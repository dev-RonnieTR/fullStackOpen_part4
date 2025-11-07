const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const bcrypt = require("bcrypt");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const { blogsInDb } = require("../utils/list_helper");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const api = supertest(app);
const initialUsers = [
	{ username: "CptPrice", password: "KillMakarov123$", name: "John Price" },
	{ username: "Gh0st", password: "JohnnyLoverX0$", name: "Simon Riley" },
	{ username: "$oap", password: "Tf141$", name: "John McTavish" },
	{ username: "Mason", password: "D4ddyResnov@", name: "Alex Mason" },
	{ username: "Woods", password: "CantKillMe1#", name: "Frank Woods" },
	{ username: "Hudson", password: "cIa1@gent", name: "Jason Hudson" },
];
const initialBlogs = [
	{
		_id: "5a422a851b54a676234d17f7",
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
		__v: 0,
	},
	{
		_id: "5a422aa71b54a676234d17f8",
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
		__v: 0,
	},
	{
		_id: "5a422b3a1b54a676234d17f9",
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
		__v: 0,
	},
	{
		_id: "5a422b891b54a676234d17fa",
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
		__v: 0,
	},
	{
		_id: "5a422ba71b54a676234d17fb",
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
		__v: 0,
	},
	{
		_id: "5a422bc61b54a676234d17fc",
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
		__v: 0,
	},
];

let user;
let userForToken;
let token;

beforeEach(async () => {
	await User.deleteMany({});
	const hashedUsers = await Promise.all(
		initialUsers.map(async ({ password, ...rest }) => {
			const passwordHash = await bcrypt.hash(password, 10);
			return { ...rest, passwordHash };
		})
	);
	await User.insertMany(hashedUsers);
	await Blog.deleteMany({});
	await Blog.insertMany(initialBlogs);

	const blogs = await Blog.find({}).lean();
	const users = await User.find({}).lean();

	const blogOps = blogs.map((blog, i) => ({
		updateOne: {
			filter: { _id: blog._id },
			update: { $set: { user: users[i]._id } },
		},
	}));

	const userOps = users.map((user, i) => ({
		updateOne: {
			filter: { _id: user._id },
			update: { $push: { blogs: blogs[i]._id } },
		},
	}));

	await Blog.bulkWrite(blogOps, { ordered: false });
	await User.bulkWrite(userOps, { ordered: false });

	user = await User.findOne();
	userForToken = {
		username: user.username,
		id: user._id,
	};
	token = jwt.sign(userForToken, process.env.SECRET);
});

describe("GET request", () => {
	test("to /api/blogs returns all blog posts", async () => {
		const res = await api.get("/api/blogs");
		console.log("BLOGS:", res.body);
		assert.strictEqual(res.body.length, initialBlogs.length);
	});
	test("to /api/blogs/:id returns an object with 'id' property instead of '_id'", async () => {
		await api.get("/api/blogs/5a422a851b54a676234d17f7").expect((res) => {
			if (res.body._id) throw new Error("Response contains _id");
			if (!res.body.id) throw new Error("Response missing id");
		});
	});
});
describe("POST request", async () => {
	test("to /api/blogs increments contents of the database by one", async () => {
		const newBlog = {
			title: "Javascript Basics",
			author: "Bruce Wayne",
			url: "google.com",
			likes: 95948,
			user: user._id,
		};
		await api
			.post("/api/blogs")
			.set("authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201);
		const finalBlogs = await Blog.find({});
		assert.strictEqual(finalBlogs.length, initialBlogs.length + 1);
	});
	test("to /api/blogs saves the blog correctly", async () => {
		const newBlog = {
			title: "Javascript Basics",
			author: "Bruce Wayne",
			url: "google.com",
			likes: 95948,
			user: user._id,
		};
		const res = await api
			.post("/api/blogs")
			.set("authorization", `Bearer ${token}`)
			.send(newBlog)
			.expect(201)
			.expect("Content-Type", /application\/json/);

		const blogs = await blogsInDb();
		const expectedBlog = blogs[blogs.length - 1];

		const normalize = ({ user, ...rest }) => {
			user = user.toString();
			return { ...rest, user };
		};
		assert.deepStrictEqual(normalize(expectedBlog), normalize(res.body));
	});
	test("without likes amount stores the blog with a default likes amount of zero", async () => {
		const newBlog = {
			title: "Javascript Basics",
			author: "Bruce Wayne",
			url: "google.com",
			likes: 95948,
			user: user._id,
		};

		const stripLikes = (blog) => {
			const { likes, ...rest } = blog;
			return rest;
		};
		await api
			.post("/api/blogs")
			.set("authorization", `Bearer ${token}`)
			.send(stripLikes(newBlog))
			.expect(201)
			.expect((res) => {
				if (!("likes" in res.body)) throw new Error("Response missing likes");
				if (res.body.likes !== 0)
					throw new Error(
						"Response returning default likes amount different from zero"
					);
			});
	});
	test("without title or url returns status 400 Bad Request", async () => {
		const newBlog = {
			title: "Javascript Basics",
			author: "Bruce Wayne",
			url: "google.com",
			likes: 95948,
			user: user._id,
		};

		const stripTitle = (blog) => {
			const { title, ...rest } = blog;
			return rest;
		};
		const stripUrl = (blog) => {
			const { url, ...rest } = blog;
			return rest;
		};
		await api.post("/api/blogs").set("authorization", `Bearer ${token}`).send(stripTitle(newBlog)).expect(400);
		await api.post("/api/blogs").set("authorization", `Bearer ${token}`).send(stripUrl(newBlog)).expect(400);
	});
});
describe("DELETE request", () => {
	test("decreases blogs in the database by one", async () => {
		await api.delete(`/api/blogs/${initialBlogs[0]._id}`).set("authorization", `Bearer ${token}`).expect(204);
		const finalBlogs = await Blog.find({});
		assert.strictEqual(finalBlogs.length, initialBlogs.length - 1);
	});
});
describe("PUT request", () => {
	test("updates likes of a blog", async () => {
		await api
			.put(`/api/blogs/${initialBlogs[0]._id}`)
			.send({ ...initialBlogs[0], likes: 100 })
			.expect(200)
			.expect((res) => {
				if (res.body.likes !== 100)
					throw new Error("response is not updating the likes");
			});
	});
});

after(async () => {
	await mongoose.connection.close();
});

//npm test -- tests/requests.test.js

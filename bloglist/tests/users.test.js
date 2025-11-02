const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { usersInDb } = require("../utils/user_test_helper");
const Blog = require("../models/blog");

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

beforeEach(async () => {
	await Blog.deleteMany({});
	await User.deleteMany({});
	const hashedUsers = await Promise.all(
		initialUsers.map(async ({ password, ...rest }) => {
			const passwordHash = await bcrypt.hash(password, 10);
			return { ...rest, passwordHash };
		})
	);
	await User.insertMany(hashedUsers);
	await Blog.insertMany(initialBlogs);

	const users = await User.find({});
	const blogs = await Blog.find({});

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

	await User.bulkWrite(userOps);
	await Blog.bulkWrite(blogOps);
});

test("User creation with fresh username is successful", async () => {
	const usersAtStart = await usersInDb();

	const newUser = {
		username: "Roach",
		password: "Fuck$hepherd00",
		name: "Gary Sanderson",
	};
	await api
		.post("/api/users")
		.send(newUser)
		.expect(201)
		.expect((res) => {
			if (res.body.username !== newUser.username)
				throw new Error("username not saved correctly");
			if (res.body.name !== newUser.name)
				throw new Error("name not saved correctly");
		});

	const usersAtEnd = await usersInDb();
	assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);
});
test("User creation with a taken username fails and returns appropriate status code and error message", async () => {
	const usersAtStart = await usersInDb();

	const newUser = {
		username: "CptPrice",
		password: "Price123$",
		name: "James Price",
	};
	await api
		.post("/api/users")
		.send(newUser)
		.expect(400)
		.expect((res) => {
			if (!res.body.error.includes("expected 'username' to be unique"))
				throw new Error("response not returning correct error message");
		});

	const usersAtEnd = await usersInDb();
	assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});
test("User creation with invalid username fails", async () => {
	const usersAtStart = await usersInDb();

	const newUser = { username: "ab", password: "Price123$" };
	await api.post("/api/users").send(newUser).expect(400);

	const usersAtEnd = await usersInDb();

	assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});
test("User creation fails when password is too weak", async () => {
	const usersAtStart = await usersInDb();

	const newUser = { username: "MakarovX", password: "123456789" };
	await api
		.post("/api/users")
		.send(newUser)
		.expect(400)
		.expect((res) => {
			if (
				!res.body.error.includes(
					"The password must have at least 7 characters, one uppercase, one lowercase, one number and one special character"
				)
			)
				throw new Error("response returning incorrect message");
		});

	const usersAtEnd = await usersInDb();

	assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});
test("GET request to /api/users shows all users", async () => {
	const users = await usersInDb();
	const result = await api
		.get("/api/users")
		.expect(200)
		.expect((res) => {
			if (res.body.length !== users.length)
				throw new Error("response not returning all users");
		});
});
test("GET request to one resource pulls information about that one user", async () => {
	const users = await usersInDb();
	const result = await api.get(`/api/users/${users[0].id}`).expect(200);
});
after(() => mongoose.connection.close());

// npm test -- tests/users.test.js

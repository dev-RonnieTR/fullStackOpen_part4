const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const initialBlogs = require("../utils/list_helper").blogs;

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(initialBlogs);
});

describe("GET request", () => {
	test("to /api/blogs returns all blog posts", async () => {
		const res = await api.get("/api/blogs");
		assert.strictEqual(res.body.length, initialBlogs.length);
	});
	test("to /api/blogs/:id returns an object with 'id' property instead of '_id'", async () => {
		await api.get("/api/blogs/5a422a851b54a676234d17f7").expect((res) => {
			if (res.body._id) throw new Error("Response contains _id");
			if (!res.body.id) throw new Error("Response missing id");
		});
	});
});
describe("POST request", () => {
	const newBlog = {
		title: "Javascript Basics",
		author: "Bruce Wayne",
		url: "google.com",
		likes: 95948,
	};
	test("to /api/blogs increments contents of the database by one", async () => {
		await api.post("/api/blogs").send(newBlog).expect(201);
		const finalBlogs = await Blog.find({});
		assert.strictEqual(finalBlogs.length, initialBlogs.length + 1);
	});
	test("to /api/blogs saves the blog correctly", async () => {
		const res = await api
			.post("/api/blogs")
			.send(newBlog)
			.expect(201)
			.expect((res) => {
				if (!res.body.id) throw new Error("Response missing id");
			});
		const stripId = (body) => {
			const { id, ...rest } = body;
			return rest;
		};
		assert.deepStrictEqual(stripId(res.body), newBlog);
	});
	test("without likes amount stores the blog with a default likes amount of zero", async () => {
		const stripLikes = (blog) => {
			const { likes, ...rest } = blog;
			return rest;
		};
		await api
			.post("/api/blogs")
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
		const stripTitle = (blog) => {
			const { title, ...rest } = blog;
			return rest;
		};
		const stripUrl = (blog) => {
			const { url, ...rest } = blog;
			return rest;
		};
		await api.post("/api/blogs").send(stripTitle(newBlog)).expect(400);
		await api.post("/api/blogs").send(stripUrl(newBlog)).expect(400);
	});
});
describe("DELETE request", () => {
	test("decreases blogs in the database by one", async () => {
		await api.delete(`/api/blogs/${initialBlogs[0]._id}`).expect(204);
		const finalBlogs = await Blog.find({});
		assert.strictEqual(finalBlogs.length, initialBlogs.length - 1);
	});
});

after(async () => {
	await mongoose.connection.close();
});

//npm test -- tests/requests.test.js

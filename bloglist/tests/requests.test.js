const { test, describe, after, beforeEach } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Blog = require("../models/blog");
const blogs = require("../utils/list_helper").blogs;

const api = supertest(app);

beforeEach(async () => {
	await Blog.deleteMany({});
	await Blog.insertMany(blogs);
	console.log("Insertion successful");
});

describe("GET request", () => {
	test("to /api/blogs returns all blog posts", async () => {
		const res = await api.get("/api/blogs");
		assert.strictEqual(res.body.length, blogs.length);
	});
	test("to /api/blogs/:id returns an object with 'id' property instead of '_id'", async () => {
		await api.get("/api/blogs/5a422a851b54a676234d17f7").expect((res) => {
			if (res.body._id) throw new Error("Response contains _id");
			if (!res.body.id) throw new Error("Response missing id");
		});
	});
});

after(async () => {
	await mongoose.connection.close();
});

//npm test -- tests/requests.test.js

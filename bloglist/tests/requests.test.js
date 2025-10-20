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

test("GET request to /api/blogs returns all blog posts", async () => {
	const res = await api.get("/api/blogs");
	console.log("Fetch successful");
	console.log(res);
	assert.strictEqual(res.body.length, blogs.length);
});

after(async () => {
	await mongoose.connection.close();
});

//npm test -- tests/requests.test.js

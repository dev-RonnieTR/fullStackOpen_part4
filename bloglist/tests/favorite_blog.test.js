const { test, describe } = require("node:test");
const assert = require("node:assert");

const favoriteBlog = require("../utils/list_helper").favoriteBlog;
const blogs = require("../utils/list_helper").blogs;

describe("Favorite blog", () => {
	test("from an empty list", () => {
		assert.deepStrictEqual(favoriteBlog([]), "no favorite blog");
	});
	test("from a list of blogs", () => {
		assert.deepStrictEqual(favoriteBlog(blogs), blogs[2]);
	});
});

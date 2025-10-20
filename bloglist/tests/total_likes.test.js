const { test, describe } = require("node:test");
const assert = require("node:assert");

const totalLikes = require("../utils/list_helper").totalLikes;

const blogs = require("../utils/list_helper").blogs;

describe("Total likes", () => {
	test("of an empty list is zero", () => {
		assert.strictEqual(totalLikes([]), 0);
	});
	test("when list has only one blog equals the likes of that", () => {
		assert.strictEqual(totalLikes([blogs[0]]), 7);
	});
	test("of a bigger list is calculated right", () => {
		assert.strictEqual(totalLikes(blogs), 36);
	});
});

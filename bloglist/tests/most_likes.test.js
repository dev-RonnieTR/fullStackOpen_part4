const { test, describe } = require("node:test");
const assert = require("node:assert");

const mostLikes = require("../utils/list_helper").mostLikes;

const blogs = require("../utils/list_helper").blogs;

describe("Author with the most likes", () => {
	test("from an empty list returns 'no blogs found'", () => {
		assert.strictEqual(mostLikes([]), "no blogs found");
	});
	test("from a list with only one blog returns that author", () => {
		assert.deepStrictEqual(mostLikes([blogs[0]]), {
			author: "Michael Chan",
			likes: 7,
		});
	});
	test("from a list with multiple blogs returns author with the most likes", () => {
		assert.deepStrictEqual(mostLikes(blogs), {
			author: "Edsger W. Dijkstra",
			likes: 17,
		});
	});
});

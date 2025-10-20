const { test, describe } = require("node:test");
const assert = require("node:assert");

const mostBlogs = require("../utils/list_helper").mostBlogs;

const blogs = require("../utils/list_helper").blogs;

describe("Author with the most blogs", () => {
	test("from an empty list returns 'no blogs found'", () => {
		assert.strictEqual(mostBlogs([]), "no blogs found");
	});
    test("from a list with only one blog returns that author", () => {
        assert.deepStrictEqual(mostBlogs([blogs[0]]), { author: "Michael Chan", blogs: 1});
    });
    test("from a list with multiple blogs returns author with the most blogs published", () => {
        assert.deepStrictEqual(mostBlogs(blogs), { author: "Robert C. Martin", blogs: 3})
    })
});

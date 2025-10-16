const { test } = require("node:test");
const assert = require("node:assert");

const listHelper = require("../utils/list_helper");

test("Dummy returns one", () => {
    const blogs = [];
    assert.strictEqual(listHelper.dummy(blogs), 1);
})
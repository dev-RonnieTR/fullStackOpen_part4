const { test, describe } = require("node:test");
const assert = require("node:assert");

const totalLikes = require("../utils/list_helper").totalLikes;

describe("Total likes", () => {
    test("of an empty list is zero", () => {
        assert.strictEqual(totalLikes([]), 0);
    });
    test("when list has only one blog equals the likes of that", () => {
       assert.strictEqual(totalLikes([{ likes: 150 }]), 150); 
    });
    test("of a bigger list is calculated right", () => {
       assert.strictEqual(totalLikes([{ likes: 150 }, { likes: 123 }, { likes: 117 }, { likes: 92 }, { likes: 67 }]), 549); 
    })
})


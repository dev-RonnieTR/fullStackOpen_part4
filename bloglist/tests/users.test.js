const app = require("../app");
const supertest = require("supertest");
const api = supertest(app);

const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { initialUsers, usersInDb } = require("../utils/user_test_helper");

beforeEach(async () => {
	await User.deleteMany({});
	const hashedUsers = await Promise.all(
		initialUsers.map(async ({ password, ...rest }) => {
			const passwordHash = await bcrypt.hash(password, 10);
			return { ...rest, passwordHash };
		})
	);
	await User.insertMany(hashedUsers);
});

test("User creation with fresh username is successful", async () => {
	const usersAtStart = await usersInDb();

	const newUser = {
		username: "Roach",
		password: "FuckShepherd00",
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
test("User creation with a taken username returns appropriate status code and error message", async () => {
	const usersAtStart = await usersInDb();

	const newUser = {
		username: "CptPrice",
		password: "123",
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

after(() => mongoose.connection.close());

// npm test -- tests/users.test.js

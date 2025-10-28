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
		password: "Fuck$hepherd00",
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
test("User creation with a taken username fails and returns appropriate status code and error message", async () => {
	const usersAtStart = await usersInDb();

	const newUser = {
		username: "CptPrice",
		password: "Price123$",
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
test("User creation with invalid username fails", async () => {
	const usersAtStart = await usersInDb();

	const newUser = { username: "ab", password: "Price123$" };
	await api.post("/api/users").send(newUser).expect(400);

	const usersAtEnd = await usersInDb();

	assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});
test("User creation fails when password is too weak", async () => {
	const usersAtStart = await usersInDb();

	const newUser = { username: "MakarovX", password: "123456789" };
	await api
		.post("/api/users")
		.send(newUser)
		.expect(400)
		.expect((res) => {
			if (
				!res.body.error.includes(
					"The password must have at least 7 characters, one uppercase, one lowercase, one number and one special character"
				)
			)
				throw new Error("response returning incorrect message");
		});

	const usersAtEnd = await usersInDb();

	assert.strictEqual(usersAtEnd.length, usersAtStart.length);
});
test("GET request to /api/users shows all users", async () => {
	const users = await usersInDb();
	const result = await api.get("/api/users").expect(200).expect((res) => {
		
		if (res.body.length !== users.length) throw new Error ("response not returning all users")
	})
	
	assert.deepStrictEqual(result.body[0], users[0]);
})
test("GET request to one resource pulls information about that one user", async () => {
	const users = await usersInDb();
	const result = await api.get(`/api/users/${users[0].id}`).expect(200);
	
	assert.deepStrictEqual(result.body, users[0]);
})
after(() => mongoose.connection.close());

// npm test -- tests/users.test.js

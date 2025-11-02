const { test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");

beforeEach(async () => {
	await User.deleteMany({});
	const passwordHash = await bcrypt.hash("KillMakarov123$", 10);
	await User.create({ username: "CptPrice", passwordHash });
});

test("Successful login", async () => {
	const loginRequest = { username: "CptPrice", password: "KillMakarov123$" };
	await api.post("/api/login").send(loginRequest).expect(200).expect((res) => {
        if (!res.body.token) throw new Error("token not being appended to response")
    });
});
test("Unsuccessful login attempt when username or password are incorrect. Returns appropriate status code and message", async () => {
	const loginRequestI = { username: "CptPric", password: "KillMakarov123$" };
	const loginRequestII = { username: "CptPrice", password: "KillMakarov1234$" };

	await api
		.post("/api/login")
		.send(loginRequestI)
		.expect(401)
		.expect((res) => {
			if (!res.body.error) throw new Error("error message not being displayed");
			if (res.body.error !== "invalid username or password")
				throw new Error("error is not displaying the right message");
		});
	await api
		.post("/api/login")
		.send(loginRequestII)
		.expect(401)
		.expect((res) => {
			if (!res.body.error) throw new Error("error message not being displayed");
			if (res.body.error !== "invalid username or password")
				throw new Error("error is not displaying the right message");
		});
});

after(() => mongoose.connection.close());

// npm test -- tests/login.test.js

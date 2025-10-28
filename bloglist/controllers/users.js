const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.post("/", async (req, res, next) => {
	try {
		const { username, password, name } = req.body;
		const strongPasswordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{7,}$/;
		if (!strongPasswordRegex.test(password)) {
			throw new Error("Weak password");
		}
		const saltRounds = 10;
		const passwordHash = await bcrypt.hash(password, saltRounds);

		const user = new User({ username, passwordHash, name });
		const savedUser = await user.save();
		return res.status(201).json(savedUser);
	} catch (error) {
		next(error);
	}
});

module.exports = usersRouter;

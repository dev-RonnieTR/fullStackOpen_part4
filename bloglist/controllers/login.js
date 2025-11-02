const loginRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

loginRouter.post("/", async (req, res, next) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect =
			user === null ? false : await bcrypt.compare(password, user.passwordHash);
		console.log(isPasswordCorrect);

		if (!(user && isPasswordCorrect)) {
			throw new Error("invalid credentials");
		}

		const userForToken = {
			username: user.username,
			id: user._id,
		};
		const token = jwt.sign(userForToken, process.env.SECRET);

		return res
			.status(200)
			.send({ token, username: user.username, name: user.name });
	} catch (error) {
		next(error);
	}
});

module.exports = loginRouter;

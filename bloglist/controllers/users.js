const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const User = require("../models/user");

usersRouter.get("/", async (req, res, next) => {
	try {
		const users = await User.find({}).populate("blogs", { user: 0});
		return res.status(200).json(users);
	} catch (error) {
		next(error);
	}
});
usersRouter.get("/:id", async (req, res, next) => {
	try {
		const user = await User.findById(req.params.id).populate("blogs");
		return res.status(200).json(user);
	} catch (error) {
		next(error);
	}
});

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

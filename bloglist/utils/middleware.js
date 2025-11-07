const jwt = require("jsonwebtoken");
const logger = require("./logger");
const User = require("../models/user");

const requestLogger = (req, res, next) => {
	logger.info("Method:", req.method);
	logger.info("Path:", req.path);
	logger.info("Body:", req.body);
	logger.info("---");
	next();
};

const tokenExtractor = (req, res, next) => {
	try {
		const authorization = req.get("authorization");
		req.token =
			authorization && authorization.startsWith("Bearer ")
				? authorization.replace("Bearer ", "")
				: null;
		next();
	} catch (error) {
		next(error);
	}
};

const userExtractor = async (req, res, next) => {
	try {
		if (!(req.method === "POST" || req.method === "DELETE")) return next();
		if (req.token === null) throw new Error("null token");
		
		const decodedToken = jwt.verify(req.token, process.env.SECRET);
		
		if (!decodedToken.id) throw new Error("id missing");

		req.user = await User.findById(decodedToken.id);
		if (!req.user) throw new Error("user not in database")

		next();
	} catch (error) {
		next(error);
	}
};

const unknownEndpoint = (req, res) => {
	res.status(404).json({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
	logger.error(error.message);

	if (error.name === "CastError") {
		return res.status(400).json({ error: "malformatted id" });
	} else if (error.name === "ValidationError") {
		return res.status(400).json({ error: error.message });
	}
	if (
		error.name === "MongoServerError" &&
		error.message.includes("E11000 duplicate key error")
	) {
		return res.status(400).json({ error: "expected 'username' to be unique" });
	}
	if (error.message === "Weak password") {
		return res.status(400).json({
			error:
				"The password must have at least 7 characters, one uppercase, one lowercase, one number and one special character",
		});
	}
	if (error.message === "invalid credentials") {
		return res.status(401).json({ error: "invalid username or password" });
	}
	if (error.message === "null token")
		return res
			.status(401)
			.json({ error: "could not find a token for the request" });
	if (error.message === "id missing")
		return res.status(401).json({ error: "token malformed" });
	if (error.message === "user not in database")
		return res.status(401).json({ error: "invalid user" });
	if (error.name === "JsonWebTokenError")
		return res.status(401).json({ error: "token invalid" });
	if (error.message === "unauthorized")
		return res
			.status(401)
			.json({ error: "user is not authorized to perform this request" });
	next(error);
};

const customMiddleware = {
	requestLogger,
	tokenExtractor,
	userExtractor,
	unknownEndpoint,
	errorHandler,
};

module.exports = customMiddleware;

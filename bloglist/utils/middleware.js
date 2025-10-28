const logger = require("./logger");

const requestLogger = (req, res, next) => {
	logger.info("Method:", req.method);
	logger.info("Path:", req.path);
	logger.info("Body:", req.body);
	logger.info("---");
	next();
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
		return res
			.status(400)
			.json({
				error:
					"The password must have at least 7 characters, one uppercase, one lowercase, one number and one special character",
			});
	}
	next(error);
};

const customMiddleware = { requestLogger, unknownEndpoint, errorHandler };

module.exports = customMiddleware;

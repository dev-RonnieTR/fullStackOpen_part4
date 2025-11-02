const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");

const blogsRouter = require("./controllers/blogs");
const usersRouter = require("./controllers/users");
const loginRouter = require("./controllers/login");

const config = require("./utils/config");
const logger = require("./utils/logger");
const customMiddleware = require("./utils/middleware");
const { requestLogger, unknownEndpoint, errorHandler } = customMiddleware;

const app = express();

(async () => {
	try {
		await mongoose.connect(config.MONGODB_URI);
	} catch (error) {
		logger.error("Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
})();

app.use(express.json());
app.use(requestLogger);

app.use("/api/blogs", blogsRouter);
app.use("/api/users", usersRouter);
app.use("/api/login", loginRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
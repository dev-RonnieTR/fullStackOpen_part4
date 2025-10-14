const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");
const logger = require("./utils/logger");

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

app.use("/api/blogs", blogsRouter);

module.exports = app;
const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const blogsRouter = require("./controllers/blogs");
const config = require("./utils/config");

const app = express();


(async () => {
	try {
		await mongoose.connect(config.MONGODB_URI);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
})();

app.use(express.json());

app.use("/api/blogs", blogsRouter);

app.listen(config.PORT, ()=> {
    console.log("Server running on port", config.PORT);
})
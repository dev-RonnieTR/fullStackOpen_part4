const express = require("express");
const mongoose = require("mongoose");
const Blog = require("./models/blog");
const blogsRouter = require("./controllers/blogs");

const app = express();

const mongoUrl =
	"mongodb+srv://ronaldoteran2407_db_user:Ron1998@cluster0.58lxoyj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

(async () => {
	try {
		await mongoose.connect(mongoUrl);
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
		process.exit(1);
	}
})();

app.use(express.json());

app.use("/api/blogs", blogsRouter);

const PORT = 3003;
app.listen(PORT, ()=> {
    console.log("Server running on port", PORT);
})
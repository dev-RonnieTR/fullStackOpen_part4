const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res, next) => {
	const blogs = await Blog.find({});
	res.status(200).json(blogs);
});

blogsRouter.post("/", async (req, res, next) => {
	const blog = new Blog(req.body);
	const result = await blog.save();
	res.status(201).json(result);
});

module.exports = blogsRouter;
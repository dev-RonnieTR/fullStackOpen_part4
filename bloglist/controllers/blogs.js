const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res, next) => {
	const blogs = await Blog.find({});
	res.status(200).json(blogs);
});

blogsRouter.get("/:id", async (req, res, next) => {
	const blog = await Blog.findById(req.params.id);
	res.status(200).json(blog);
});

blogsRouter.post("/", async (req, res, next) => {
	req.body.likes = req.body.likes ?? 0;
	const blog = new Blog(req.body);
	const result = await blog.save();
	res.status(201).json(result);
});

module.exports = blogsRouter;

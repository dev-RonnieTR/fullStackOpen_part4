const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (req, res, next) => {
	try {
		const blogs = await Blog.find({});
		res.status(200).json(blogs);
	} catch (error) {
		next(error);
	}
});
blogsRouter.get("/:id", async (req, res, next) => {
	try {
		const blog = await Blog.findById(req.params.id);
		res.status(200).json(blog);
	} catch (error) {
		next(error);
	}
});

blogsRouter.post("/", async (req, res, next) => {
	try {
		req.body.likes = req.body.likes ?? 0;
		const blog = new Blog(req.body);
		const result = await blog.save();
		res.status(201).json(result);
	} catch (error) {
		next(error);
	}
});

blogsRouter.delete("/:id", async (req, res, next) => {
	try {
		await Blog.deleteOne({ _id: req.params.id });
		return res.status(204).end();
	} catch (error) {
		next(error);
	}
});

blogsRouter.put("/:id", async (req, res, next) => {
	try {
		const updatedBlog = await Blog.findByIdAndUpdate(
			req.params.id,
			{ likes: req.body.likes ?? 0},
			{ new: true, runValidators: true }
		);
		return res.status(200).json(updatedBlog);
	} catch (error) {
		next(error);
	}
});

module.exports = blogsRouter;

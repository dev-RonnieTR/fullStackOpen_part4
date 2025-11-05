const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

blogsRouter.get("/", async (req, res, next) => {
	try {
		const blogs = await Blog.find({}).populate("user", {
			username: 1,
			name: 1,
		});
		res.status(200).json(blogs);
	} catch (error) {
		next(error);
	}
});
blogsRouter.get("/:id", async (req, res, next) => {
	try {
		const blog = await Blog.findById(req.params.id).populate("user", {
			username: 1,
			name: 1,
		});
		if (!blog) return res.status(404).json({ error: "blog does not exist"});
		console.log(blog);
		res.status(200).json(blog);
	} catch (error) {
		next(error);
	}
});

blogsRouter.post("/", async (req, res, next) => {
	try {
		if (req.token === null) throw new Error("null token");
		const decodedToken = jwt.verify(req.token, process.env.SECRET);
		if (!decodedToken.id) throw new Error("id missing");
		const user = await User.findById(decodedToken.id);

		if (!user) throw new Error("user not in database");

		const blog = new Blog(req.body);
		blog.user = user._id;
		blog.likes = blog.likes ?? 0;

		const result = await blog.save();
		user.blogs = [...user.blogs, result._id];
		await user.save();
		return res.status(201).json(result);
	} catch (error) {
		next(error);
	}
});

blogsRouter.delete("/:id", async (req, res, next) => {
	try {
		const requestedBlog = await Blog.findById(req.params.id);
		if (!requestedBlog)
			return res.status(404).json({ error: "blog does not exist" });

		if (req.token === null) throw new Error("null token");
		const decodedToken = jwt.verify(req.token, process.env.SECRET);
		if (!decodedToken.id) throw new Error("id missing");

		if (!(requestedBlog.user.toString() === decodedToken.id))
			throw new Error("unauthorized");

		await requestedBlog.deleteOne();
		return res.status(204).end();
	} catch (error) {
		next(error);
	}
});

blogsRouter.put("/:id", async (req, res, next) => {
	try {
		const updatedBlog = await Blog.findByIdAndUpdate(
			req.params.id,
			{ likes: req.body.likes ?? 0 },
			{ new: true, runValidators: true }
		);
		return res.status(200).json(updatedBlog);
	} catch (error) {
		next(error);
	}
});

module.exports = blogsRouter;

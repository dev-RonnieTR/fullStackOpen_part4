const Blog = require("../models/blog");
const User = require("../models/user");


const initialBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
];

const dummy = (array) => {
	return 1;
};

const totalLikes = (blogList) => {
	let likes = 0;
	blogList.forEach((blog) => {
		likes = likes + blog.likes;
	});

	return likes;
};

const favoriteBlog = (blogList) => {
	if (blogList.length === 0) return "no favorite blog";

	let favorite = blogList[0];
	blogList.forEach((blog) => {
		favorite = blog.likes > favorite.likes ? blog : favorite;
	});

	return favorite;
};

const mostBlogs = (blogList) => {
	if (blogList.length === 0) return "no blogs found";
	if (blogList.length === 1) return { author: blogList[0].author, blogs: 1 };

	let counter = {};

	blogList.forEach((blog) => {
		counter[blog.author] = counter[blog.author] ? counter[blog.author] + 1 : 1;
	});

	const entries = Object.entries(counter);

	let largestValue = entries[0];

	entries.forEach((entry) => {
		largestValue = entry[1] > largestValue[1] ? entry : largestValue;
	});

	return { author: largestValue[0], blogs: largestValue[1] };
};

const mostLikes = (blogList) => {
	if (blogList.length === 0) return "no blogs found";
	if (blogList.length === 1)
		return { author: blogList[0].author, likes: blogList[0].likes };

	const counter = {};

	blogList.forEach((blog) => {
		counter[blog.author] = counter[blog.author]
			? counter[blog.author] + blog.likes
			: blog.likes;
	});

	const entries = Object.entries(counter);

	let largestValue = entries[0];

	entries.forEach((entry) => {
		largestValue = entry[1] > largestValue[1] ? entry : largestValue;
	});

	return { author: largestValue[0], likes: largestValue[1] };
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
}

const listHelper = { initialBlogs, dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes, blogsInDb };
module.exports = listHelper;

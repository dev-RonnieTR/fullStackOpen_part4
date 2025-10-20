const blogs = [
	{
		title: "React patterns",
		author: "Michael Chan",
		url: "https://reactpatterns.com/",
		likes: 7,
	},
	{
		title: "Go To Statement Considered Harmful",
		author: "Edsger W. Dijkstra",
		url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
		likes: 5,
	},
	{
		title: "Canonical string reduction",
		author: "Edsger W. Dijkstra",
		url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
		likes: 12,
	},
	{
		title: "First class tests",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
		likes: 10,
	},
	{
		title: "TDD harms architecture",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
		likes: 0,
	},
	{
		title: "Type wars",
		author: "Robert C. Martin",
		url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
		likes: 2,
	},
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

const listHelper = { blogs, dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
module.exports = listHelper;

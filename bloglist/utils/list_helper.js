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

const listHelper = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
module.exports = listHelper;

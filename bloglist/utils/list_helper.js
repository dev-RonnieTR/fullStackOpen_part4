const dummy = (array) => {
	return 1;
};

const totalLikes = (blogList) => {
	
	let likes = 0;
	blogList.forEach((blog) => {
		likes = likes + blog.likes
	})
	
	return likes;
}

listHelper = { dummy, totalLikes };
module.exports = listHelper;

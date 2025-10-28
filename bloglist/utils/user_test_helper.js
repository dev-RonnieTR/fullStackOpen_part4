const User = require("../models/user");

const initialUsers = [
	{ username: "CptPrice", password: "KillMakarov123$", name: "John Price" },
	{ username: "Gh0st", password: "JohnnyLoverX0$", name: "Simon Riley" },
	{ username: "$oap", password: "Tf141$", name: "John McTavish" },
];

const usersInDb = async () => {
    const users = await User.find({});
    return users.map((user) => user.toJSON());  
}

module.exports = { initialUsers, usersInDb }
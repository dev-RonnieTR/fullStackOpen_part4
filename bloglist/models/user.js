const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    username: { type: String, minLength: 3, required: true, unique: true },
    passwordHash: { type: String, minLength: 7, required: true },
    name: String
})

userSchema.set("toJSON", {
    transform: (document, returnedObj) => {
        returnedObj.id = returnedObj._id.toString();
        delete returnedObj._id;
        delete returnedObj.__v;
        delete returnedObj.passwordHash; //for security purposes, passwordHash should not be displayed.
    }
})

const User = mongoose.model("User", userSchema);

module.exports = User;
const mongoose = require("mongoose");
const { ADMIN, AUTHOR } = require("../constants/userRoles");

const UserSchema = new mongoose.Schema(
	{
		image: String,
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			enum: [ADMIN, AUTHOR],
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		password: {
			type: String,
			required: true,
		},
	},

	{ timestamps: true }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;

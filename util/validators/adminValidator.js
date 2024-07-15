const { body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");
const User = require("../../models/userModel");
const { ADMIN, AUTHOR } = require("../../constants/userRoles");

exports.createUserValidator = [
	body("email")
		.isEmail()
		.withMessage("invalid email")
		.custom(async (value, { req }) => {
			const user = await User.findOne({ email: value });
			if (user) {
				throw new Error("this email already exist");
			}
			return true;
		}),
	body("userName").custom(async (value) => {
		const user = await User.findOne({ userName: value });
		if (user) {
			throw new Error("this user name already exist");
		}
		return true;
	}),
	body("password").custom((value, { req }) => {
		if (value !== req.body.confirmPassword) {
			throw new Error("password must match confirm password");
		}
		return true;
	}),
	body("role").isIn([ADMIN, AUTHOR]).withMessage("invalid role value"),
	validatorMiddleware,
];

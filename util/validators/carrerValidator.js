const { body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validetorMiddleware");
const Carrer = require("../../models/carrerModel");

exports.createCarrerValidator = [
	body("firstName").notEmpty(),
	body("lastName").notEmpty(),
	body("email").notEmpty().isEmail(),
	body("phoneNumber")
		.notEmpty()
		.custom((value) => {
			if (!/^\+?\d{1,3}\d{3,14}$/.test(value)) {
				throw new Error("Invalid phone number");
			}
			return true;
		}),
	validatorMiddleware,
];

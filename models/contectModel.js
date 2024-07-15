const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		subject: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;
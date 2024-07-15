const mongoose = require("mongoose");

const CarrerContentSchema = new mongoose.Schema({
	title: String,
	paragraph: String,
	titleAr: String,
	paragraphAr: String,
});

const CarrerSchema = new mongoose.Schema(
	{
		firstName: String,
		lastName: String,
		email: String,
		phoneNumber: String,
		message: String,
		cvFile: String,
	},
	{ timestamps: true }
);

const Carrer = mongoose.model("Carrer", CarrerSchema);

const CarrerContent = mongoose.model("CarrerContent", CarrerContentSchema);

module.exports = {
	CarrerContent,
	Carrer,
};

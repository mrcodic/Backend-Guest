const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
	name: String,

	parentCategory: {
		type: mongoose.Schema.ObjectId,
		ref: "Category",
		default: null,
	},
});

const Category = mongoose.model("Category", CategorySchema);

module.exports = Category;

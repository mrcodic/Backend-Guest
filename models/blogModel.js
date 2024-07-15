const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},

		content: {
			type: String,
			required: true,
		},

		image: String,

		category: [
			{
				type: mongoose.Schema.ObjectId,
				ref: "Category",
				requird: true,
			},
		],

		tags: [{ type: mongoose.Schema.ObjectId, ref: "Tag", default: null }],

		// author: {
		// 	type: mongoose.Schema.ObjectId,
		// 	ref: "User",
		// },

		author: String,

		isPublished: Boolean,

		brief: String,
	},
	{ timestamps: true }
);

const Blog = mongoose.model("Blog", BlogSchema);

module.exports = Blog;

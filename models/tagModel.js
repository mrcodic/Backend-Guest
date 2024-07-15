const mongoose = require("mongoose");

const TagSchema = new mongoose.Schema({
	name: String,
});

const Tag = mongoose.model("Tag", TagSchema);

module.exports = Tag;

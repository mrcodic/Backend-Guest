const mongoose = require("mongoose");

const ControlsSchema = new mongoose.Schema({
	phone: String,
	email: String,
	location: String,
});

const Controls = mongoose.model("Controls", ControlsSchema);

module.exports = Controls;

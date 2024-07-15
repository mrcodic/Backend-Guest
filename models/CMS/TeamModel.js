const mongoose = require("mongoose");

const TeamMemberSchema = new mongoose.Schema({
	image: String,
	name: String,
	nameAr: String,
	role: String,
	roleAr: String,
	bio: String,
	bioAr: String,
	order: Number,
});

const TeamSchema = new mongoose.Schema({
	header: {
		image: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		labelAr: {
			type: String,
			default: null,
		},
	},
	title: String,
	paragraph: String,
	members: [{ type: mongoose.Schema.ObjectId, ref: "TeamMember" }],
});

const TeamMember = mongoose.model("TeamMember", TeamMemberSchema);
const Team = mongoose.model("Team", TeamSchema);

module.exports = {
	Team,
	TeamMember,
};

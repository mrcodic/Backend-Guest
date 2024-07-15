const mongoose = require("mongoose");

const SocialMemberSchema = new mongoose.Schema(
	{
		image: String,
		title: String,
		titleAr: String,
		content: String,
		contentAr: String,
	},
	{ timestamps: true }
);

const SocialSchema = new mongoose.Schema({
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

	socailMembers: [{ type: mongoose.Schema.ObjectId, ref: "SocialMember" }],

	// image: String,
	// title: String,
	// titleAr: String,
	// content: String,
	// contentAr: String,
});

const SocialMember = mongoose.model("SocialMember", SocialMemberSchema);
const Social = mongoose.model("Social", SocialSchema);

module.exports = { SocialMember, Social };

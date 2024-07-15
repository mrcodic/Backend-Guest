const mongoose = require("mongoose");

const BoardMemberImageSchmea = new mongoose.Schema({
	image: { type: String, default: null },
});

const BoardMemberSchema = new mongoose.Schema({
	images: [{ type: mongoose.Schema.ObjectId, ref: "MemberImage" }],
	name: { type: String, default: null },
	nameAr: { type: String, default: null },
	role: { type: String, default: null },
	roleAr: { type: String, default: null },
	order: Number,
});

const BoardSchema = new mongoose.Schema({
	header: {
		image: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		labelAr: String,
	},
	message: {
		name: { type: String, default: null },
		nameAr: String,
		content: { type: String, default: null },
		contentAr: String,
		image: { type: String, default: null },
	},
	members: [{ type: mongoose.Schema.ObjectId, ref: "BoardMember" }],
});

const MemberImage = mongoose.model("MemberImage", BoardMemberImageSchmea);
const BoardMember = mongoose.model("BoardMember", BoardMemberSchema);
const Board = mongoose.model("Board", BoardSchema);

module.exports = {
	MemberImage,
	BoardMember,
	Board,
};

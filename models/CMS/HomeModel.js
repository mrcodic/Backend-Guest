const mongoose = require("mongoose");

const HomeHeaderSchema = new mongoose.Schema({
	image: {
		type: String,
		default: null,
	},
	video: {
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
});

const StatisticsSchema = new mongoose.Schema({
	label: String,
	labelAr: String,
	value: String,
	valueAr: String,
	image: String,
});

const TimeLineHeaderSchema = new mongoose.Schema({
	title: String,
	paragraph: String,
	titleAr: String,
	paragraphAr: String,
});

const TimeLineSchema = new mongoose.Schema({
	year: String,
	yearAr: String,
	label: String,
	labelAr: String,
	image: String,
});

const IndustrySchema = new mongoose.Schema({
	image: String,
	label: String,
	labelAr: String,
	link: String,
});

const PartnersSchema = new mongoose.Schema({
	image: String,
	order: Number,
});

const MessageSchema = new mongoose.Schema({
	name: String,
	nameAr: String,
	content: String,
	contentAr: String,
	image: String,
});

const AboutSchema = new mongoose.Schema({
	title: String,
	titleAr: String,
	content: String,
	contentAr: String,
	images: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Image",
		},
	],
});

const HomeSchema = new mongoose.Schema({
	header: [{ type: mongoose.Schema.ObjectId, ref: "HomeHeader" }],
	statistics: [{ type: mongoose.Schema.ObjectId, ref: "Statistics" }],
	timeLine: [{ type: mongoose.Schema.ObjectId, ref: "TimeLine" }],
	industries: [{ type: mongoose.Schema.ObjectId, ref: "Industry" }],
	partners: [{ type: mongoose.Schema.ObjectId, ref: "Partner" }],
	message: { type: mongoose.Schema.ObjectId, ref: "Message" },
});

const HomeHeader = mongoose.model("HomeHeader", HomeHeaderSchema);
const Statistics = mongoose.model("Statistics", StatisticsSchema);
const TimeLine = mongoose.model("TimeLine", TimeLineSchema);
const TimeLineHeader = mongoose.model("TimeLineHeader", TimeLineHeaderSchema);
const Industry = mongoose.model("Industry", IndustrySchema);
const Partner = mongoose.model("Partner", PartnersSchema);
const Message = mongoose.model("Message", MessageSchema);
const About = mongoose.model("About", AboutSchema);

const Home = mongoose.model("Home", HomeSchema);

module.exports = {
	Home,
	HomeHeader,
	Statistics,
	TimeLine,
	TimeLineHeader,
	Industry,
	Partner,
	Message,
	About,
};

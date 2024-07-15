const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
	image: String,
});

const TimeLineHeaderWhoWeAreSchema = new mongoose.Schema({
	title: String,
	paragraph: String,
	titleAr: String,
	paragraphAr: String,
});

const WhoWeAreTimeLineSchema = new mongoose.Schema({
	year: String,
	yearAr: String,
	label: String,
	labelAr: String,
	image: String,
});

const WhoWeAreSchema = new mongoose.Schema({
	sliderImages: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Image",
		},
	],
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
	mission: {
		image: String,
		label: String,
		labelAr: String,
		content: String,
		contentAr: String,
	},
	vision: {
		image: String,
		label: String,
		labelAr: String,
		content: String,
		contentAr: String,
	},
	companyPDF: String,
});

const WhoWeAreTimeLine = mongoose.model(
	"WhoWeAreTimeLine",
	WhoWeAreTimeLineSchema
);
const Image = mongoose.model("Image", ImageSchema);
const WhoWeAre = mongoose.model("WhoWeAre", WhoWeAreSchema);
const WhoWeAreTimeLineHeader = mongoose.model(
	"WhoWeAreTimeLineHeader",
	TimeLineHeaderWhoWeAreSchema
);

module.exports = {
	Image,
	WhoWeAre,
	WhoWeAreTimeLine,
	WhoWeAreTimeLineHeader,
};

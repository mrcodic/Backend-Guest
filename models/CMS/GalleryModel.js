const mongoose = require("mongoose");

const imageGallerySchme = new mongoose.Schema({
	category: { type: mongoose.ObjectId, ref: "GalleryCategory" },
	image: String,
	label: String,
	labelAr: String,
	title: String,
	titleAr: String,
	link: String,
});

const GallerySchema = new mongoose.Schema({
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

	gallery: [{ type: mongoose.Schema.ObjectId, ref: "ImageGallery" }],
});

const ImageGallery = mongoose.model("ImageGallery", imageGallerySchme);
const Gallery = mongoose.model("Gallery", GallerySchema);

module.exports = {
	ImageGallery,
	Gallery,
};

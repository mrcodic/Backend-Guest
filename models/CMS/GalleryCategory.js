const mongoose = require("mongoose");

const GalleryCategorySchema = new mongoose.Schema({
	name: String,
	nameAr: String,
});

const GalleryCategory = mongoose.model(
	"GalleryCategory",
	GalleryCategorySchema
);

module.exports = GalleryCategory;

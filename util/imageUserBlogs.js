const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const deleteImage = async (imagePath, folder) => {
	if (imagePath) {
		try {
			const filePath = path.join("uploads", folder, imagePath);
			await fs.promises.unlink(filePath);
		} catch (error) {
			console.error("Error deleting image:", error);
		}
	}
};

const saveBase64Image = async (base64String, folder) => {
	try {
		const imageBuffer = Buffer.from(base64String, "base64");
		const uniqueFilename = `image-${Date.now()}-cover.jpeg`;
		const filePath = path.join("uploads", folder, uniqueFilename);

		await sharp(imageBuffer)
			.toFormat("jpeg")
			.jpeg({ quality: 100 })
			.toFile(filePath);

		return uniqueFilename;
	} catch (error) {
		console.error("Error saving base64 image:", error);
		throw new Error("Image processing failed");
	}
};

exports.saveAndDeleteImage = async (
	existingImagePath,
	newBase64Image,
	folder
) => {
	if (newBase64Image) {
		const newImage = await saveBase64Image(newBase64Image, folder);
		if (existingImagePath) {
			await deleteImage(existingImagePath, folder);
		}
		return newImage;
	}
	return existingImagePath;
};

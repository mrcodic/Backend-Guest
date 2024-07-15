const fs = require("fs");
const path = require("path");
const sharp = require("sharp");


exports.deleteImage = async (imagePath, folder) => {
	if (imagePath) {
		try {
			const filePath = path.join("uploads", "cms", folder, imagePath);
			await fs.promises.unlink(filePath);
		} catch (error) {
			console.error("Error deleting image:", error);
		}
	}
};

const saveBase64Image = async (base64String, folder, isImage) => {
	try {
			// Decode base64 string to binary buffer
			const imageBuffer = Buffer.from(base64String, 'base64');

			// Detect image format based on the magic number (file signature)
			let fileExtension;
			let formatOptions = {};

			if (imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8) {
					fileExtension = 'jpeg'; // JPEG format
					formatOptions = { quality: 100 };
			} else if (
					imageBuffer[0] === 0x89 && imageBuffer[1] === 0x50 &&
					imageBuffer[2] === 0x4E && imageBuffer[3] === 0x47
			) {
					fileExtension = 'png'; // PNG format
			} else {
					throw new Error('Unsupported image format');
			}

			// Generate unique filename
			const uniqueFilename = `image-${Date.now()}-cover.${fileExtension}`;

			// Construct file path
			const filePath = path.join('uploads', 'cms', folder, uniqueFilename);

			// Save image
			if (isImage) {
					let image = sharp(imageBuffer);
					if (fileExtension === 'jpeg') {
							image = image.jpeg(formatOptions);
					} else if (fileExtension === 'png') {
							image = image.png();
					}
					await image.toFile(filePath);
			} else {
					// Save video
					await fs.writeFile(filePath, imageBuffer);
			}

			return uniqueFilename;
	} catch (error) {
			console.error('Error saving base64 image:', error);
			throw new Error('Image processing failed');
	}
};








exports.saveAndDeleteImage = async (
	existingImagePath,
	newBase64Image,
	folder,
	isImage = true
) => {
	if (newBase64Image) {
		const newImage = await saveBase64Image(newBase64Image, folder, isImage);
		if (existingImagePath) {
			await this.deleteImage(existingImagePath, folder);
		}
		return newImage;
	}
	return existingImagePath;
};

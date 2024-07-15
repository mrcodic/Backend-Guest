const fs = require("fs");
const path = require("path");

const multer = require("multer");
const sharp = require("sharp");
const ApiError = require("../util/ApiError");

const ensureDirectoryExists = (directory) => {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
};

const storage = multer.memoryStorage();

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (!file.mimetype.startsWith("image/")) {
			return cb(new Error("Uploaded file is not an image"));
		}
		cb(null, true);
	},
}).single("image");

exports.uploadImage = async (req, res, next) => {
	upload(req, res, (err) => {
		if (err instanceof multer.MulterError) {
			return next(new ApiError("Failed to upload image: " + err.message, 400));
		} else if (err) {
			return next(new ApiError("Failed to upload image", 500));
		}
	});
	next();
};

exports.resizeImage = async (req, res, next) => {
	try {
		if (req.file || req.body.image) {
			let buffer;

			if (req.file) {
				buffer = req.file.buffer;
			} else if (req.body.image) {
				buffer = Buffer.from(req.body.image, "base64");
			}

			const imageFileName = `image-${Date.now()}-cover.jpeg`;

			let uploadFolder = "uploads";

			if (req.url.includes("/user")) {
				uploadFolder = "uploads/user";
			} else if (req.url.includes("/blog")) {
				uploadFolder = "uploads/blog";
			} else if (req.url.includes("/cms")) {
				uploadFolder = "uploads/cms";
			}

			ensureDirectoryExists(uploadFolder);

			await sharp(buffer)
				.toFormat("jpeg")
				.jpeg({ quality: 100 })
				.toFile(`${uploadFolder}/${imageFileName}`);

			req.body.image = imageFileName;
		}
		next();
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.uploadCvMiddleware = async (req, res, next) => {
	if (!req.body.cvFile) {
		return res.status(400).send("No file uploaded.");
	}

	try {
		const base64Data = req.body.cvFile;

		const base64File = base64Data.replace(/^data:application\/pdf;base64,/, "");

		const buffer = Buffer.from(base64File, "base64");

		const randomNumber = Math.floor(Math.random() * (10000 - 1 + 1)) + 1;
		const randomString = Math.random()
			.toString(36)
			.substring(2, 5)
			.toUpperCase();

		const filePath =
			"uploads/CVs/" +
			"cv-" +
			req.body.firstName +
			"-" +
			req.body.lastName +
			"-" +
			randomNumber +
			randomString +
			".pdf";

		await fs.writeFile(filePath, buffer, (err) => {
			if (err) {
				return res.status(500).json({ error: "Failed to save file" });
			}
		});

		const fileName =
			"cv-" +
			req.body.firstName +
			"-" +
			req.body.lastName +
			"-" +
			randomNumber +
			randomString +
			".pdf";

		req.body.cvFile = fileName;

		next();
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

const GalleryCategory = require("../../models/CMS/GalleryCategory");
const { ImageGallery } = require("../../models/CMS/GalleryModel");
const ApiError = require("../../util/ApiError");
const { deleteImage } = require("../../util/imagesUtility");

exports.createGalleryCategory = async (req, res, next) => {
	try {
		const { name } = req.body;

		const existingCategory = await GalleryCategory.findOne({ name });

		if (existingCategory) {
			return res.status(400).json({
				status: "fail",
				result: null,
				success: false,
				message: "this category already exisit",
			});
		}

		const newCategory = await GalleryCategory.create({ name });

		return res.status(201).json({
			status: "success",
			result: newCategory,
			success: true,
			message: "Category Created Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getGalleryCategories = async (req, res, next) => {
	try {
		const categories = await GalleryCategory.find({}).select("_id name");

		return res.status(200).json({
			status: "success",
			result: categories,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getGalleryCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;
		const category = await GalleryCategory.findById(categoryId);

		return res.status(200).json({
			status: "success",
			result: category,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateGalleryCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;
		const { name } = req.body;

		const updatedCategory = await GalleryCategory.findByIdAndUpdate(
			categoryId,
			{ name },
			{ new: true }
		);

		return res.status(200).json({
			status: "success",
			result: updatedCategory,
			success: true,
			message: "Category Updated Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteGalleryCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;

		const galleryIamges = await ImageGallery.find({
			category: categoryId,
		}).select("image");

		for (const img of galleryIamges) {
			await deleteImage(img.image, "gallery");
		}

		await ImageGallery.deleteMany({ category: categoryId });

		await GalleryCategory.findByIdAndDelete(categoryId);

		return res.status(200).json({
			status: "success",
			result: [],
			success: true,
			message: "Category Deleted Successfully",
		});
	} catch (error) {
		next(new ApiError("something went wrong " + error, 500));
	}
};

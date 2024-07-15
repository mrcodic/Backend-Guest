const mongoose = require("mongoose");
const Category = require("../models/categoryModel");
const Blog = require("../models/blogModel");
const ApiError = require("../util/ApiError");

// @desc create category and optional sub-category
// @route POST /api/v1/admin/category
// @access Private
exports.createCategory = async (req, res, next) => {
	try {
		const { name, parentCategory } = req.body;

		const category = await Category.create({ name, parentCategory });

		return res.status(200).json({
			status: "success",
			result: category,
			success: true,
			message: "ctegory created successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get categories
// @route GET /api/v1/admin/category
// @access Private
exports.getCategories = async (req, res, next) => {
	try {
		const { limit, skip } = req.pagination;

		// const categories = await Category.aggregate([
		// 	{
		// 		$lookup: {
		// 			from: "categories",
		// 			localField: "parentCategory",
		// 			foreignField: "_id",
		// 			as: "parentCategoryData",
		// 		},
		// 	},
		// 	{
		// 		$addFields: {
		// 			parentCategoryName: { $arrayElemAt: ["$parentCategoryData.name", 0] },
		// 		},
		// 	},
		// 	{
		// 		$project: {
		// 			name: 1,
		// 			parentCategoryName: 1,
		// 		},
		// 	},

		// 	{
		// 		$limit: limit,
		// 	},

		// 	{
		// 		$skip: skip,
		// 	},
		// ]);

		const categories = await Category.find()
			.populate("parentCategory")
			.limit(limit)
			.skip(skip);

		const formattedCategories = categories.map((category) => {
			return {
				...category.toObject(),
				parentCategory: category.parentCategory
					? category.parentCategory.name
					: null,
			};
		});

		return res.status(200).json({
			status: "success",
			result: formattedCategories,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get parent categories for drop down list
// @route GET /api/v1/admin/category/DDL
// @access Private
exports.getParentCategoriesDDL = async (req, res, next) => {
	try {
		const parents = await Category.find({
			parentCategory: { $eq: null },
		}).select("name");

		return res.status(200).json({
			status: "success",
			result: parents,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};
// @desc get Sub categories for drop down list
// @route GET /api/v1/admin/category/sub/DDL
// @access Private
exports.getSubCategoriesDDL = async (req, res, next) => {
	try {
		const subs = await Category.find({
			parentCategory: { $ne: null },
		});

		return res.status(200).json({
			status: "success",
			result: subs,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get category
// @route GET /api/v1/admin/category/:categoryId
// @access Private
exports.getCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;

		// const category = await Category.aggregate([
		// 	{
		// 		$match: { _id: new mongoose.Types.ObjectId(categoryId) },
		// 	},
		// 	{
		// 		$lookup: {
		// 			from: "subcategories",
		// 			localField: "subCategory",
		// 			foreignField: "_id",
		// 			as: "subCategoryData",
		// 		},
		// 	},
		// 	{
		// 		$addFields: {
		// 			subCategoryCount: { $size: "$subCategoryData" },
		// 		},
		// 	},
		// 	{
		// 		$project: {
		// 			name: 1,
		// 			subCategory: {
		// 				$cond: {
		// 					if: { $eq: ["$subCategoryCount", 1] },
		// 					then: { $arrayElemAt: ["$subCategoryData.name", 0] },
		// 					else: "$subCategoryData.name",
		// 				},
		// 			},
		// 		},
		// 	},
		// ]);

		const category = await Category.findById(categoryId);

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

// @desc update category
// @route PATCH /api/v1/admin/category/:categoryId
// @access Private
exports.updateCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;
		const { name, parentCategory } = req.body;

		// if (subCategory) {
		// 	const categoryToBeUpdated = await Category.findById(categoryId);

		// 	// for (let [
		// 	// 	index,
		// 	// 	subCategoryToBeUpdated,
		// 	// ] of categoryToBeUpdated.subCategory) {
		// 	// 	await SubCategory.findByIdAndUpdate(
		// 	// 		subCategoryToBeUpdated,
		// 	// 		{
		// 	// 			name: subCategory[index],
		// 	// 		},
		// 	// 		{
		// 	// 			new: true,
		// 	// 		}
		// 	// 	);
		// 	// }

		// 	for (let i = 0; i < categoryToBeUpdated.subCategory.length; i++) {
		// 		const subCategoryId = categoryToBeUpdated.subCategory[i];

		// 		if (i < subCategory.length) {
		// 			const updatedSubCategoryName = subCategory[i];

		// 			await SubCategory.findByIdAndUpdate(
		// 				subCategoryId,
		// 				{ name: updatedSubCategoryName },
		// 				{ new: true }
		// 			);
		// 		}
		// 	}
		// }

		const updatedCategory = await Category.findByIdAndUpdate(
			categoryId,
			{
				name,
				parentCategory,
			},
			{
				new: true,
			}
		);

		return res.status(200).json({
			status: "success",
			result: updatedCategory,
			success: true,
			message: "category updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc delete category
// @route DELETE /api/v1/admin/category/:categoryId
// @access Private
exports.deleteCategory = async (req, res, next) => {
	try {
		const { categoryId } = req.params;

		await Category.deleteMany({ parentCategory: categoryId });

		await Category.findByIdAndDelete(categoryId);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "category deleted successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc hard delete categories
// @route DELETE /api/v1/admin/category
// @access Private
exports.deleteMenyCategories = async (req, res, next) => {
	try {
		const { categoryIds } = req.body;

		if (!categoryIds || categoryIds.length === 0) {
			return res.status(400).json({
				status: "fail",
				message: "Category IDs array is required and must not be empty.",
			});
		}

		const categoryIdObjects = categoryIds.map(
			(categoryId) => new mongoose.Types.ObjectId(categoryId)
		);

		await Category.deleteMany({ parentCategory: { $in: categoryIdObjects } });

		await Category.deleteMany({
			_id: { $in: categoryIdObjects },
		});

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "categories deleted",
		});
	} catch (error) {
		console.error("Error deleting users and images:", error);
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getSubCategoriesBasedOnParent = async (req, res, next) => {
	try {
		const { parents } = req.body;

		const subs = await Category.find({
			parentCategory: { $in: parents },
		}).select("name _id");


			return res.status(200).json({
			status: "success",
			result: subs,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

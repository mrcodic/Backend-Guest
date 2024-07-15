const mongoose = require("mongoose");
const Tag = require("../models/tagModel");
const ApiError = require("../util/ApiError");

// @desc create tag
// @route POST /api/v1/admin/tag
// @access Private
exports.createTag = async (req, res, next) => {
	try {
		const { name } = req.body;

		const tag = await Tag.create({ name });

		return res.status(201).json({
			status: "success",
			result: tag,
			success: true,
			message: "new tag created successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc read all tags
// @route GET /api/v1/admin/tag
// @access Private
exports.getTags = async (req, res, next) => {
	try {
		const { limit, skip } = req.pagination;

		const tags = await Tag.find({}).limit(limit).skip(skip);

		return res.status(200).json({
			status: "success",
			result: tags,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc read one tag
// @route GET /api/v1/admin/tag/:tagId
// @access Private
exports.getTag = async (req, res, next) => {
	try {
		const { tagId } = req.params;

		const tag = await Tag.findById(tagId);

		if (!tag) {
			return next(new ApiError("tag not found by this id " + postId, 404));
		}

		return res.status(200).json({
			status: "success",
			result: tag,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc update tag
// @route PATCH /api/v1/admin/tag/:tagId
// @access Private
exports.updateTag = async (req, res, next) => {
	try {
		const { tagId } = req.params;
		const { name } = req.body;

		if (!tagId) {
			return next(new ApiError("tag id is required", 404));
		}

		const tag = await Tag.findByIdAndUpdate(tagId, { name }, { new: true });

		return res.status(200).json({
			status: "success",
			result: tag,
			success: true,
			message: "tag updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc delete tag
// @route DELETE /api/v1/admin/tag/:tagId
// @access Private
exports.deleteTag = async (req, res, next) => {
	try {
		const { tagId } = req.params;

		if (!tagId) {
			return next(new ApiError("tag id is required", 404));
		}

		await Tag.findByIdAndDelete(tagId);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "post deleted successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc hard delete tags
// @route DELETE /api/v1/admin/tag
// @access Private
exports.deleteMenyTags = async (req, res, next) => {
	try {
		const { tagIds } = req.body;

		if (!tagIds || tagIds.length === 0) {
			return res.status(400).json({
				status: "fail",
				message: "Tag IDs array is required and must not be empty.",
			});
		}

		const tagIdObjects = tagIds.map(
			(tagId) => new mongoose.Types.ObjectId(tagId)
		);

		await Tag.deleteMany({
			_id: { $in: tagIdObjects },
		});

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "tags deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

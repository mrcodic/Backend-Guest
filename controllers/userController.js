const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/userModel");
const ApiError = require("../util/ApiError");
const { processImage } = require("../util/proccessImage");
const { saveAndDeleteImage } = require("../util/imageUserBlogs");

// @desc create user
// @route POST /api/v1/admin/user
// @access Private
exports.createUser = async (req, res, next) => {
	try {
		const { password } = req.body;

		const hashedPassword = await bcryptjs.hash(password, 12);

		const newUser = await User.create({
			...req.body,
			password: hashedPassword,
		});

		return res.status(201).json({
			status: "success",
			result: {
				image: newUser.image,
				firstName: newUser.firstName,
				lastName: newUser.lastName,
				userName: newUser.userName,
				email: newUser.email,
				role: newUser.role,
			},
			success: true,
			message: "new user created successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get all users
// @route GET /api/v1/admin/user
// @access Private
exports.getUsers = async (req, res, next) => {
	try {
		const { limit, skip } = req.pagination;

		const users = await User.aggregate([
			{
				$addFields: {
					fullName: {
						$concat: [
							{ $toUpper: { $substrCP: ["$firstName", 0, 1] } },
							{
								$toLower: {
									$substrCP: [
										"$firstName",
										1,
										{ $subtract: [{ $strLenCP: "$firstName" }, 1] },
									],
								},
							},
							" ",
							{ $toUpper: { $substrCP: ["$lastName", 0, 1] } },
							{
								$toLower: {
									$substrCP: [
										"$lastName",
										1,
										{ $subtract: [{ $strLenCP: "$lastName" }, 1] },
									],
								},
							},
						],
					},
				},
			},
			{
				$project: {
					image: 1,
					fullName: 1,
					userName: 1,
					role: 1,
					email: 1,
					createdAt: 1,
					updatedAt: 1,
					__v: 1,
				},
			},
			{ $limit: limit },
			{ $skip: skip },
			{ $sort: { createdAt: -1 } },
		]);

		await Promise.all(
			users.map((user) => {
				user.image = processImage(res, user, "user");
			})
		);

		return res.status(200).json({
			status: "success",
			result: users,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get user by id
// @route GET /api/v1/admin/user/:userId
// @access Private
exports.getUser = async (req, res, next) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return next(new ApiError("user not found by this id " + userId, 404));
		}

		const user = await User.findById(userId).select("-password");

		user.image = processImage(res, user, "user");

		return res.status(200).json({
			status: "success",
			result: user,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get authenticated user
// @route GET /api/v1/author/user/auth
// @access Private
exports.getAuthenticatedUser = async (req, res, next) => {
	try {
		const userId = req.user._id;

		const user = await User.findById(userId).select("-password -role");

		if (!userId) {
			return next(new ApiError("user not found by this id " + userId, 404));
		}

		user.image = processImage(res, user, "user");

		return res.status(200).json({
			status: "success",
			result: user,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc update user data
// @route PATCH /api/v1/admin/user/:userId
// @access Private
exports.updateUser = async (req, res, next) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return next(new ApiError("User ID not provided", 404));
		}

		let user = await User.findById(userId);

		if (!user) {
			return next(new ApiError("User not found", 404));
		}

		if (req.body.image) {
			const newImage = await saveAndDeleteImage(
				user.image,
				req.body.image,
				"user"
			);
			req.body.image = newImage;
		} else {
			req.body.image = user.image;
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ ...req.body, password: user.password },
			{ new: true }
		).select("-password");

		return res.status(200).json({
			status: "success",
			result: updatedUser,
			success: true,
			message: "User updated successfully",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error.message, 500));
	}
};

exports.updateUserProfile = async (req, res, next) => {
	try {
		const userId = req.user._id;

		let user = await User.findById(userId).select("-password -role");

		if (!user) {
			return next(new ApiError("User not found", 404));
		}

		if (req.body.image) {
			const newImage = await saveAndDeleteImage(
				user.image,
				req.body.image,
				"user"
			);
			req.body.image = newImage;
		} else {
			req.body.image = user.image;
		}

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ ...req.body, password: user.password },
			{ new: true }
		).select("-password");

		return res.status(200).json({
			status: "success",
			result: updatedUser,
			success: true,
			message: "User updated",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error.message, 500));
	}
};

// @desc hard delete user
// @route DELETE /api/v1/admin/user/:userId
// @access Private
exports.deleteUser = async (req, res, next) => {
	try {
		const { userId } = req.params;

		if (!userId) {
			return next(new ApiError("user not found by this id " + userId, 404));
		}

		const user = await User.findById(userId);

		if (!user) {
			return next(new ApiError("User not found", 404));
		}

		fs.unlink(path.join("uploads", "user", user.image), (err) => {
			if (err) throw err;
		});

		await User.findByIdAndDelete(userId);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "user deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc hard delete users
// @route DELETE /api/v1/admin/user
// @access Private
exports.deleteMenyUsers = async (req, res, next) => {
	try {
		const { userIds } = req.body;

		if (!userIds || userIds.length === 0) {
			return res.status(400).json({
				status: "fail",
				message: "User IDs array is required and must not be empty.",
			});
		}

		const users = await User.find({ _id: { $in: userIds } });

		const userIdObjects = userIds.map(
			(userId) => new mongoose.Types.ObjectId(userId)
		);

		for (const user of users) {
			fs.unlink(path.join("uploads", "user", user.image), (err) => {
				if (err) throw Error(err);
			});
		}

		await User.deleteMany({
			_id: { $in: userIdObjects },
		});

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "users deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc reset user password
// @route PATCH /api/v1/author/user/reset-password
// @access Private
exports.resetPassword = async (req, res, next) => {
	try {
		const { oldPassword, newPassword, confirmPassword } = req.body;
		const userId = req.user._id;

		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		const isMatch = await bcryptjs.compare(oldPassword, user.password);

		if (!isMatch) {
			return res.status(400).json({ message: "Wrong old password" });
		}

		const isNewEqualOld = await bcryptjs.compare(newPassword, user.password);

		if (isNewEqualOld) {
			return res
				.status(400)
				.json({ message: "You can't write same old password" });
		}

		if (newPassword !== confirmPassword) {
			return res.status(400).json({
				message: "New password and confirmation password do not match",
			});
		}

		const hashedPassword = await bcryptjs.hash(newPassword, 12);

		user.password = hashedPassword;
		await user.save();

		return res.status(201).json({
			status: "success",
			result: {
				image: user.image,
				firstName: user.firstName,
				lastName: user.lastName,
				userName: user.userName,
				email: user.email,
				role: user.role,
			},
			success: true,
			message: "password changed successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

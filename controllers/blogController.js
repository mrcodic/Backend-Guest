const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const mongoose = require("mongoose");
const Blog = require("../models/blogModel");
const ApiError = require("../util/ApiError");
const { processImage } = require("../util/proccessImage");
const { saveAndDeleteImage } = require("../util/imageUserBlogs");

// @desc create blog and save it
// @route POST /api/v1/author/blog
// @access Private
exports.createPost = async (req, res, next) => {
	try {
		const { subCategory, mainCategory } = req.body;

		const categoryArray = Array.from(mainCategory);

		let categories;
		if (subCategory) {
			const subCategoryArray = Array.from(subCategory);
			categories = [...categoryArray, ...subCategoryArray];
		}
		categories = categoryArray;

		const post = await Blog.create({
			...req.body,
			author: req.user.userName,
			category: categories,
		});

		return res.status(201).json({
			status: "success",
			result: {
				title: post.title,
				content: post.content,
				image: post.image,
				category: post.category,
				tags: post.tags,
				author: post.author,
				isPublished: post.isPublished,
			},
			success: true,
			message: "new post created successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc read all blogs
// @route GET /api/v1/author/blog
// @access Private
// exports.getPosts = async (req, res, next) => {
// 	try {
// 		const { limit, skip } = req.pagination;

// 		const posts = await Blog.aggregate([
// 			{
// 				$lookup: {
// 					from: "users",
// 					foreignField: "_id",
// 					localField: "author",
// 					as: "author",
// 				},
// 			},

// 			{
// 				$addFields: {
// 					authorName: { $arrayElemAt: ["$author.userName", 0] },
// 				},
// 			},

// 			{
// 				$project: {
// 					title: 1,
// 					authorName: 1,
// 					category: 1,
// 					tags: 1,
// 					updatedAt: 1,
// 				},
// 			},

// 			{ $limit: limit },
// 			{ $skip: skip },
// 			{ $sort: { createdAt: -1 } },
// 		]);

// 		return res.status(200).json({
// 			status: "success",
// 			result: posts,
// 			success: true,
// 			message: "success",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

// @desc read all published blogs
// @route GET /api/v1/author/blog
// @access Private
exports.getPublishedPosts = async (req, res, next) => {
	try {
		const { limit, skip } = req.pagination;

		const posts = await Blog.find({ isPublished: true })
			.populate([
				{
					path: "category",
					populate: {
						path: "parentCategory",
						select: "name",
					},
				},
				{
					path: "tags",
					select: "name",
				},
			])
			.limit(limit)
			.skip(skip)
			.sort({ createdAt: -1 });

		const formattedPosts = posts.map((post) => {
			const parents = [];
			const subs = [];

			for (const cat of post.category) {
				if (cat.parentCategory === null) {
					parents.push(cat.name);
				} else {
					subs.push(cat.name);
				}
			}

			let tagNames;
			if (post.tags) {
				tagNames = post.tags.map((tag) => tag.name);
			}
			const imageLink = processImage(res, post, "blog");

			return {
				_id: post._id,
				image: imageLink,
				title: post.title,
				content: post.content,
				tags: tagNames,
				authorName: post.author,
				mainCategory: parents,
				subCategory: subs,
				brief: post.brief,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt,
			};
		});

		return res.status(200).json({
			status: "success",
			result: formattedPosts,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error.message, 500));
	}
};

// @desc read all drafted blogs
// @route GET /api/v1/author/blog/draft
// @access Private
exports.getDraftedPosts = async (req, res, next) => {
	try {
		const { limit, skip } = req.pagination;

		const posts = await Blog.find({ isPublished: false })
			.populate([
				{
					path: "category",
					populate: {
						path: "parentCategory",
						select: "name",
					},
				},
				{
					path: "tags",
					select: "name",
				},
			])
			.limit(limit)
			.skip(skip)
			.sort({ createdAt: -1 });

		const formattedPosts = posts.map((post) => {
			const parents = [];
			const subs = [];

			for (const cat of post.category) {
				if (cat.parentCategory === null) {
					parents.push(cat.name);
				} else {
					subs.push(cat.name);
				}
			}

			let tagNames;
			if (post.tags) {
				tagNames = post.tags.map((tag) => tag.name);
			}
			const imageLink = processImage(res, post, "blog");

			return {
				_id: post._id,
				image: imageLink,
				title: post.title,
				content: post.content,
				tags: tagNames,
				authorName: post.author,
				mainCategory: parents,
				subCategory: subs,
				brief: post.brief,
				createdAt: post.createdAt,
				updatedAt: post.updatedAt,
			};
		});

		return res.status(200).json({
			status: "success",
			result: formattedPosts,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error.message, 500));
	}
};

// @desc read one post blog
// @route GET /api/v1/author/blog/:postId
// @access Private
exports.getPost = async (req, res, next) => {
	try {
		const { postId } = req.params;

		const post = await Blog.findById(postId).populate([
			{
				path: "category",
				populate: {
					path: "parentCategory",
					select: "name",
				},
			},
			{
				path: "tags",
			},
			{
				path: "author",
				select: "name", // Include any fields you need from the author
			},
		]);

		if (!post) {
			return next(new ApiError("Post not found by this id " + postId, 404));
		}

		const imageLink = processImage(res, post, "blog");

		const mainCategories = new Map();
		const subCategories = [];

		post.category.forEach((cat) => {
			if (cat.parentCategory) {
				subCategories.push({
					_id: cat._id,
					name: cat.name,
				});
				mainCategories.set(cat.parentCategory._id.toString(), {
					_id: cat.parentCategory._id,
					name: cat.parentCategory.name,
				});
			} else {
				mainCategories.set(cat._id.toString(), {
					_id: cat._id,
					name: cat.name,
				});
			}
		});

		const response = {
			_id: post._id,
			title: post.title,
			image: imageLink,
			content: post.content,
			brief: post.brief,
			tags: post.tags.map((tag) => ({
				_id: tag._id,
				name: tag.name,
			})),
			updatedAt: post.updatedAt,
			createdAt: post.createdAt,
			isPublished: post.isPublished,
			mainCategories: Array.from(mainCategories.values()), // Convert map values to array
			subCategories: subCategories,
			author: post.author,
		};

		return res.status(200).json({
			status: "success",
			result: response,
			success: true,
			message: "Success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

// @desc update post
// @route PATCH /api/v1/author/blog/:postId
// @access Private
exports.updatePost = async (req, res, next) => {
	try {
		const { postId } = req.params;
		const { mainCategory, subCategory, tags } = req.body;

		if (!postId) {
			return next(new ApiError("Post ID not provided", 404));
		}

		let post = await Blog.findById(postId);

		if (!post) {
			return next(new ApiError("Post not found", 404));
		}

		if (req.body.image) {
			const newImage = await saveAndDeleteImage(
				post.image,
				req.body.image,
				"blog"
			);
			req.body.image = newImage;
		} else {
			req.body.image = post.image;
		}

		let categories = [];
		if (mainCategory && mainCategory.length > 0) {
			const uniqueMainCategories = new Set(req.body.mainCategory);
			mainCategory.forEach((category) => uniqueMainCategories.add(category));
			categories.push(...uniqueMainCategories);
		}

		if (subCategory && subCategory.length > 0) {
			const uniqueSubCategories = new Set(req.body.subCategory);
			subCategory.forEach((category) => uniqueSubCategories.add(category));
			categories.push(...uniqueSubCategories);
		}

		if (tags && tags.length > 0) {
			const uniqueTags = new Set(req.body.tags);
			tags.forEach((tag) => uniqueTags.add(tag));
			req.body.tags = [...uniqueTags];
		}

		if (categories.length === 0) categories = post.category;

		const updatedPost = await Blog.findByIdAndUpdate(
			postId,
			{ ...req.body, category: categories },
			{ new: true }
		);

		return res.status(200).json({
			status: "success",
			result: updatedPost,
			success: true,
			message: "Post updated successfully",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error.message, 500));
	}
};

// @desc delete post
// @route DELETE /api/v1/author/blog/:postId
// @access Private
exports.deletePost = async (req, res, next) => {
	try {
		const { postId } = req.params;

		if (!postId) {
			return next(new ApiError("post not found by this id " + postId, 404));
		}

		const post = await Blog.findById(postId);

		if (!post) {
			return next(new ApiError("post not found", 404));
		}

		fs.unlink(path.join("uploads", "blog", post.image), (err) => {
			if (err) throw err;
		});

		await Blog.findByIdAndDelete(postId);

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

// @desc hard delete blogs
// @route DELETE /api/v1/admin/blog
// @access Private
exports.deleteMenyPosts = async (req, res, next) => {
	try {
		const { postIds } = req.body;

		if (!postIds || postIds.length === 0) {
			return res.status(400).json({
				status: "fail",
				message: "User IDs array is required and must not be empty.",
			});
		}

		const posts = await Blog.find({ _id: { $in: postIds } });

		const publicIdsToDelete = [];
		posts.forEach((post) => {
			publicIdsToDelete.push(post.image.publicId);
		});

		const postIdObjects = postIds.map(
			(postId) => new mongoose.Types.ObjectId(postId)
		);

		for (const post of posts) {
			fs.unlink(path.join("uploads", "blog", post.image), (err) => {
				if (err) throw Error(err);
			});
		}

		await Blog.deleteMany({
			_id: { $in: postIdObjects },
		});

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "posts deleted",
		});
	} catch (error) {
		console.error("Error deleting users and images:", error);
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc toggle post status
// @route PATCH /api/v1/admin/blog/status/:postId
// @access Private
exports.togglePostStatus = async (req, res, next) => {
	try {
		const { postId } = req.params;

		const post = await Blog.findById(postId);
		post.isPublished = !post.isPublished;
		await post.save();

		return res.status(200).json({
			status: "success",
			result: post,
			success: true,
			message: "posts status changed",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

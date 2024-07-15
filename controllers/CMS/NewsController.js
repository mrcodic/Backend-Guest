const { host } = require("../../constants/host");
const { News, NewsPost } = require("../../models/CMS/NewsModel");
const Blog = require("../../models/blogModel");
const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage } = require("../../util/imagesUtility");

exports.updateNews = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { image, label, labelAr } = req.body;

		let section;

		if (id) {
			section = await News.findById(id);
		} else {
			section = new News();
		}

		const options = {
			upsert: true,
			new: true,
		};

		const newHeaderImage = await saveAndDeleteImage(
			section ? section.header.image : null,
			image,
			"news"
		);

		const updatedHeader = await News.findOneAndUpdate(
			{ _id: section._id },
			{
				$set: {
					header: {
						image: newHeaderImage,
						label,
						labelAr,
					},
				},
			},
			options
		);
		// section.header.image = newHeaderImage;
		// section.header.label = header?.label || section.header.label;

		// const updatedPosts = [];
		// if (news) {
		//       for (const post of news) {
		//             if (post._id) {
		//                   const existingPost = await NewsPost.findById(post._id);
		//                   const { image, title, content, link } = post;

		//                   const updatedImage = await saveAndDeleteImage(
		//                         existingPost.image,
		//                         image,
		//                         "news"
		//                   );
		//                   existingPost.image = updatedImage;
		//                   existingPost.title = title || existingPost.title;
		//                   existingPost.content = content || existingPost.content;
		//                   existingPost.link = link || existingPost.link;

		//                   await existingPost.save();

		//                   updatedPosts.push(existingPost);
		//             } else {
		//                   const { image, title, content, link } = post;
		//                   const newImage = await saveAndDeleteImage(null, image, "news");
		//                   const newPost = await NewsPost.create({
		//                         title,
		//                         content,
		//                         link,
		//                         image: newImage,
		//                   });
		//                   updatedPosts.push(newPost);
		//             }
		//       }
		// }

		// section.news = updatedPosts;
		// const updatedSection = await section.save();

		return res.status(200).json({
			status: "success",
			result: updatedHeader.header,
			success: true,
			message: "section updated successfully",
		});
	} catch (error) {
		next(new ApiError(`Something went wrong: ${error.message}`, 500));
	}
};

exports.getNews = async (req, res, next) => {
	try {
		const section = await News.findOne({}).select("-news").lean();

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}
		section.header.image = `${res.locals.baseUrl}/uploads/cms/news/${section.header.image}`;

		let posts = await Blog.find({ isPublished: true }).populate(
			"category tags"
		);

		posts = posts.map((p) => {
			return {
				_id: p._id,
				title: p.title,
				content: p.content,
				brief: p.brief,
				image: `${res.locals.baseUrl}/uploads/blog/${p.image}`,
				createdAt: p.createdAt,
			};
		});

		return res.status(200).json({
			status: "success",
			result: { ...section, posts },
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getPost = async (req, res, next) => {
	try {
		const { postId } = req.params;

		const post = await Blog.findById(postId).populate([
			{
				path: "category",
				populte: {
					path: "parentCategory",
				},
			},
			{
				path: "tags",
				select: "name",
			},
		]);

		if (!post) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "Not Found",
			});
		}

		const parents = [];
		const subs = [];

		post.category.forEach((cat) => {
			if (cat.parentCategory === null) {
				parents.push(cat.name);
			} else {
				subs.push(cat.name);
			}
		});

		const imageLink = `${res.locals.baseUrl}/uploads/blog/${post.image}`;

		const section = await News.findOne({}).select("-news").lean();

		section.header.image = `${res.locals.baseUrl}/uploads/cms/news/${section.header.image}`;

		const tagNames = post.tags.map((tag) => tag.name);

		const postCategoryIds = post.category.map((category) => category._id);

		const relatedPosts = await Blog.find({
			category: { $in: postCategoryIds },
		}).select("_id title content brief image createdAt");

		const formatRelatedPost = relatedPosts.map((p) => {
			return {
				_id: p._id,
				title: p.title,
				content: p.content,
				brief: p.brief,
				image: `${res.locals.baseUrl}/uploads/blog/${p.image}`,
				createdAt: p.createdAt,
			};
		});

		const response = {
			header: section.header,
			post: {
				title: post.title,
				image: imageLink,
				content: post.content,
				brief: post.brief,
				tags: tagNames,
				createdAt: post.createdAt,
				mainCategory: parents,
				subCategory: subs,
				author: post.author,
			},
			relatedPosts: formatRelatedPost,
		};

		return res.status(200).json({
			status: "success",
			result: response || [],
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.filterPosts = async (req, res, next) => {
	try {
		const { startDate, endDate } = req.body;

		const startDateObject = new Date(startDate);
		const endDateObject = new Date(endDate);

		const filterdPosts = await Blog.find({
			isPublished: true,
			createdAt: {
				$gte: startDateObject,
				$lte: endDateObject,
			},
		}).select("_id title content brief image createdAt");

		const formatedFilterdPosts = filterdPosts.map((p) => {
			return {
				_id: p._id,
				title: p.title,
				content: p.content,
				brief: p.brief,
				image: `${res.locals.baseUrl}/uploads/blog/${p.image}`,
				createdAt: p.createdAt,
			};
		});

		return res.status(200).json({
			status: "success",
			result: formatedFilterdPosts,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

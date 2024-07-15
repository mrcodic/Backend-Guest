const { host } = require("../../constants/host");
const { SocialMember, Social } = require("../../models/CMS/SocialModel");
const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage, deleteImage } = require("../../util/imagesUtility");

// exports.updateSocial = async (req, res, next) => {
// 	try {
// 		const { header, image, title, content, titleAr, contentAr } = req.body;

// 		const section = await Social.findOne();

// 		const newHeaderImage = await saveAndDeleteImage(
// 			section.header.image,
// 			header.image,
// 			"social"
// 		);
// 		section.header.image = newHeaderImage;
// 		section.header.label = header?.label || section.header.label;
// 		section.header.labelAr = header?.labelAr || section.header.labelAr;

// 		const newSocialImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"social"
// 		);

// 		section.image = newSocialImage;
// 		section.title = title || section.title;
// 		section.content = content || section.content;
// 		section.titleAr = titleAr || section.titleAr;
// 		section.contentAr = contentAr || section.contentAr;

// 		const updatedSection = await section.save();

// 		return res.status(200).json({
// 			status: "success",
// 			result: updatedSection,
// 			success: true,
// 			message: "Section updated",
// 		});
// 	} catch (error) {
// 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// 	}
// };

// // exports.updateSocial = async (req, res, next) => {
// // 	try {
// // 		const { id } = req.params;
// // 		const { header, image, title, content, titleAr, contentAr } = req.body;

// // 		let section;
// // 		if (id) {
// // 			section = await Social.findById(id);
// // 		} else {
// // 			section = new Social();
// // 		}

// // 		const update = {
// // 			$set: {
// // 				header: {
// // 					label: header?.label,
// // 					labelAr: header?.labelAr,
// // 					image: await saveAndDeleteImage(
// // 						section ? section.header.image : null,
// // 						header.image,
// // 						"social"
// // 					),
// // 				},
// // 				title,
// // 				titleAr,
// // 				content,
// // 				contentAr,
// // 				image: await saveAndDeleteImage(
// // 					section ? section.image : null,
// // 					image,
// // 					"social"
// // 				),
// // 			},
// // 		};

// // 		const options = {
// // 			upsert: true,
// // 			new: true,
// // 		};

// // 		const result = await Social.findOneAndUpdate(
// // 			{
// // 				_id: section._id,
// // 			},
// // 			update,
// // 			options
// // 		);

// // 		await result.save();

// // 		return res.status(200).json({
// // 			status: "success",
// // 			result: result,
// // 			success: true,
// // 			message: "Section updated",
// // 		});
// // 	} catch (error) {
// // 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// // 	}
// // };

// exports.getSocial = async (req, res, next) => {
// 	try {
// 		const section = await Social.findOne();

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.header.image = `${res.locals.baseUrl}/uploads/cms/social/${section.header.image}`;

// 		section.image = `${res.locals.baseUrl}/uploads/cms/social/${section.image}`;

// 		return res.status(200).json({
// 			status: "success",
// 			result: section,
// 			success: true,
// 			message: "success",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

const folder = "social";

// exports.createSocialHeader = async (req, res, next) => {
// 	try {
// 		const { label, labelAr, image } = req.body;

// 		const exisitingSocial = await Social.find({});

// 		if (exisitingSocial.length > 0) {
// 			return res.status(400).json({
// 				status: "fail",
// 				result: null,
// 				success: false,
// 				message: "Already there is Header",
// 			});
// 		}

// 		const headerImage = await saveAndDeleteImage(null, image, folder);

// 		const newSocial = await Social.create({
// 			header: {
// 				label,
// 				labelAr,
// 				image: headerImage,
// 			},
// 			socailMembers: [],
// 		});

// 		return res.status(201).json({
// 			status: "success",
// 			result: newSocial,
// 			success: true,
// 			message: "Social Created Successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

exports.updatedSocialHeader = async (req, res, next) => {
	try {
		const { id } = req.params;

		const { header } = req.body;

		let section;

		if (id) {
			section = await Social.findById(id);
		} else {
			section = new Social();
		}

		const updatedImage = await saveAndDeleteImage(
			section ? section.header.image : null,
			header.image,
			folder
		);

		const result = await Social.findOneAndUpdate(
			{ _id: section._id },
			{
				$set: {
					header: {
						label: header.label,
						labelAr: header.labelAr,
						image: updatedImage,
					},
				},
			},
			{
				new: true,
				upsert: true,
			}
		);

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Social Updated Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getSocialHeader = async (req, res, next) => {
	try {
		const social = await Social.findOne().select("header");

		if (!social) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const formattedHeader = {
			_id: social._id,
			label: social.header.label,
			labelAr: social.header.labelAr,
			image: `${res.locals.baseUrl}/uploads/cms/social/${social.header.image}`,
		};

		return res.status(200).json({
			status: "success",
			result: formattedHeader,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.createSocialMember = async (req, res, next) => {
	try {
		const { image, title, titleAr, content, contentAr } = req.body;

		const social = await Social.findOne();

		if (!social) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "Create Social Section First",
			});
		}

		const memberImage = await saveAndDeleteImage(null, image, folder);

		const newMemberr = await SocialMember.create({
			title,
			titleAr,
			content,
			contentAr,
			image: memberImage,
		});

		await Social.findOneAndUpdate(
			{},
			{ $push: { socailMembers: newMemberr._id } },
			{ new: true, useFindAndModify: false }
		);

		return res.status(201).json({
			status: "success",
			result: newMemberr,
			success: true,
			message: "Social Member Created Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateSocialMember = async (req, res, next) => {
	try {
		const { memberId } = req.params;
		const { title, titleAr, content, contentAr, image } = req.body;

		const exisitingMember = await SocialMember.findById(memberId);

		const updatedImage = await saveAndDeleteImage(
			exisitingMember.image,
			image,
			folder
		);

		exisitingMember.title = title || exisitingMember.title;
		exisitingMember.titleAr = titleAr || exisitingMember.titleAr;
		exisitingMember.content = content || exisitingMember.content;
		exisitingMember.contentAr = contentAr || exisitingMember.contentAr;
		exisitingMember.image = updatedImage;

		const result = await exisitingMember.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Social Updated Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getMembers = async (req, res, next) => {
	try {
		const socialMembers = await SocialMember.find({}).select("title createdAt");

		if (socialMembers.length === 0) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		// const formattedMembers = socialMembers.map((socailMember) => {
		// 	return {
		// 		_id: socailMember._id,
		// 		title: socailMember.title,
		// 		titleAr: socailMember.titleAr,
		// 		content: socailMember.content,
		// 		contentAr: socailMember.contentAr,
		// 		image: `${res.locals.baseUrl}/uploads/cms/social/${socailMember.image}`,
		// 	};
		// });

		return res.status(200).json({
			status: "success",
			result: socialMembers,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getMember = async (req, res, next) => {
	try {
		const { memberId } = req.params;

		const socialMember = await SocialMember.findById(memberId);

		if (!socialMember) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const formattedMember = {
			_id: socialMember._id,
			title: socialMember.title,
			titleAr: socialMember.titleAr,
			content: socialMember.content,
			contentAr: socialMember.contentAr,
			image: `${res.locals.baseUrl}/uploads/cms/social/${socialMember.image}`,
		};

		return res.status(200).json({
			status: "success",
			result: formattedMember,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteMember = async (req, res, next) => {
	try {
		const { memberId } = req.params;
		const deletedMember = await SocialMember.findById(memberId);

		if (!deletedMember) {
			return res.status(404).json({
				status: "fail",
				message: "Social not found",
			});
		}

		await deleteImage(deletedMember.image, folder);

		await SocialMember.findByIdAndDelete(memberId);

		await Social.findOneAndUpdate(
			{},
			{ $pull: { socailMembers: memberId } },
			{ new: true, useFindAndModify: false }
		);

		return res.status(200).json({
			status: "success",
			result: [],
			success: true,
			message: "Social Deleted Successfully",
		});
	} catch (error) {
		next(new ApiError("something went wrong " + error, 500));
	}
};

exports.getLandingSocials = async (req, res, next) => {
	try {
		const social = await Social.findOne()
			.select("-_id")
			.populate({ path: "socailMembers", select: "title titleAr createdAt" });

		if (!social) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const response = {
			header: {
				image: `${res.locals.baseUrl}/uploads/cms/social/${social.header.image}`,
				label: req.lang === "ar" ? social.header.labelAr : social.header.label,
			},
			title: req.lang === "ar" ? social.titleAr : social.title,
			content: req.lang === "ar" ? social.contentAr : social.content,
			socailMembers: social.socailMembers.map((member) => ({
				_id: member._id,
				title: req.lang === "ar" ? member.titleAr : member.title,
				createdAt: member.createdAt,
			})),
		};

		return res.status(200).json({
			status: "success",
			result: response,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

exports.getLandingSocial = async (req, res, next) => {
	try {
		const { memberId } = req.params;
		const form = await SocialMember.findById(memberId);

		if (!form) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const response = {
			title: req.lang === "ar" ? form.titleAr : form.title,
			content: req.lang === "ar" ? form.contentAr : form.content,
			image: `${res.locals.baseUrl}/uploads/cms/social/${form.image}`,
		};

		return res.status(200).json({
			status: "success",
			result: response,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

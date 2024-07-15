const {
	Board,
	BoardMember,
	MemberImage,
} = require("../../models/CMS/BoardModel");
const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage, deleteImage } = require("../../util/imagesUtility");
const { host } = require("../../constants/host");

exports.updateBoard = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { header, message, members } = req.body;

		const defaultBoardData = {
			header: {
				label: "",
				labelAr: "",
				image: null,
			},
			message: {
				name: "",
				nameAr: "",
				content: "",
				contentAr: "",
				image: null,
			},
			members: [],
		};

		let section;

		if (id) {
			section = await Board.findById(id);
		} else {
			section = new Board(defaultBoardData);
		}

		const update = {
			$set: {
				header: {
					label: header?.label,
					labelAr: header?.labelAr,
					image: await saveAndDeleteImage(
						section ? section.header.image : null,
						header.image,
						"board"
					),
				},
				message: {
					name: message?.name,
					nameAr: message?.nameAr,
					content: message?.content,
					contentAr: message?.contentAr,
					image: await saveAndDeleteImage(
						section ? section.message.image : null,
						message.image,
						"board"
					),
				},
			},
		};

		const options = {
			upsert: true,
			new: true,
		};

		const result = await Board.findOneAndUpdate(
			{ _id: section._id },
			update,
			options
		).exec();

		const updatedMembers = [];

		const existingMemberIds = members.map((m) => m._id).filter(Boolean);

		const deletedMembers = await BoardMember.find({
			_id: { $nin: existingMemberIds },
		});

		for (const m of deletedMembers) {
			for (const image of m.images) {
				await deleteImage(image, "board");
			}
		}

		await Board.updateMany(
			{ members: { $nin: existingMemberIds } },
			{ $pull: { members: { $in: deletedMembers.map((m) => m._id) } } }
		);
		await BoardMember.deleteMany({
			_id: { $nin: existingMemberIds },
		});

		// const highestOrder =
		// 	(await BoardMember.findOne().sort("-order").exec())?.order || 0;

		for (const member of members) {
			let oldMember;
			if (member._id) {
				oldMember = await BoardMember.findById(member._id);
			} else {
				oldMember = new BoardMember();
				// member.order = highestOrder + 1;
			}

			const updateImages = [];
			for (let i = 0; i < member.images.length; i++) {
				let oldImage;
				if (member.images[i]._id) {
					oldImage = await MemberImage.findById(member.images[i]._id);
				} else {
					oldImage = new MemberImage();
				}

				const existingImage = await MemberImage.findOneAndUpdate(
					{ _id: oldImage._id },
					{
						$set: {
							image: await saveAndDeleteImage(
								oldImage ? oldImage.image : null,
								member.images[i].image,
								"board"
							),
						},
					},
					options
				).exec();

				updateImages.push(existingImage);
			}

			const updatedMember = await BoardMember.findOneAndUpdate(
				{
					_id: oldMember._id,
				},
				{
					$set: {
						name: member?.name,
						nameAr: member?.nameAr,
						role: member?.role,
						roleAr: member?.roleAr,
						images: updateImages,
						order: member.order,
					},
				},
				options
			);
			updatedMembers.push(updatedMember);
		}

		result.members = updatedMembers;
		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError(`Something went wrong: ${error.message}`, 500));
	}
};

exports.getBoard = async (req, res, next) => {
	try {
		const updateBoard = await Board.find({})
			.populate({ path: "members", populate: "images" })
			.lean();

		if (updateBoard.length === 0) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const section = updateBoard[0];

		section.header.image = `${res.locals.baseUrl}/uploads/cms/board/${section.header.image}`;
		section.message.image = `${res.locals.baseUrl}/uploads/cms/board/${section.message.image}`;

		section.members.sort((a, b) => a.order - b.order);

		section.members = section.members.map((member) => {
			const formattedImages = member.images.map((img) => {
				return {
					_id: img._id,
					image: `${res.locals.baseUrl}/uploads/cms/board/${img.image}`,
				};
			});

			return {
				_id: member._id,
				name: req.lang === "ar" ? member.nameAr : member.name,
				role: req.lang === "ar" ? member.roleAr : member.role,
				images: formattedImages,
				order: member.order,
			};
		});

		const response = {
			_id: section._id,
			header: {
				image: section.header.image,
				label:
					req.lang === "ar" ? section.header.labelAr : section.header.label,
			},
			message: {
				image: section.message.image,
				title:
					req.lang === "ar" ? section.message.nameAr : section.message.name,
				content:
					req.lang === "ar"
						? section.message.contentAr
						: section.message.content,
			},
			members: section.members,
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

// exports.updateBoardMemberOrder = async (req, res, next) => {
// 	const { memberId, newOrder } = req.body;

// 	if (!memberId || newOrder === undefined) {
// 		return res.status(400).json({
// 			status: "fail",
// 			message: "Member ID and new order must be provided",
// 		});
// 	}

// 	try {
// 		const targetMember = await BoardMember.findById(memberId);

// 		if (!targetMember) {
// 			return res.status(404).json({
// 				status: "fail",
// 				message: "Member not found",
// 			});
// 		}

// 		const oldOrder = targetMember.order;

// 		if (newOrder < oldOrder) {
// 			if (newOrder + 1 === oldOrder) {
// 				await BoardMember.updateOne(
// 					{ order: newOrder },
// 					{ $set: { order: oldOrder } }
// 				);
// 			} else {
// 				await BoardMember.updateMany(
// 					{ order: { $gte: newOrder, $lt: oldOrder } },
// 					{ $inc: { order: 1 } }
// 				);
// 			}
// 		} else if (newOrder > oldOrder) {
// 			if (newOrder - 1 === oldOrder) {
// 				await BoardMember.updateOne(
// 					{ order: newOrder },
// 					{ $set: { order: oldOrder } }
// 				);
// 			} else {
// 				await BoardMember.updateMany(
// 					{ order: { $gt: oldOrder, $lte: newOrder } },
// 					{ $inc: { order: -1 } }
// 				);
// 			}
// 		}

// 		targetMember.order = newOrder;
// 		await targetMember.save();

// 		return res.status(200).json({
// 			status: "success",
// 			result: targetMember,
// 			success: true,
// 			message: "Board Member order updated successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// 	}
// };

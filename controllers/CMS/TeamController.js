const { host } = require("../../constants/host");
const { Team, TeamMember } = require("../../models/CMS/TeamModel");
const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage, deleteImage } = require("../../util/imagesUtility");

exports.updateTeamSection = async (req, res, next) => {
	try {
		const { header, title, paragraph, members } = req.body;

		const section = await Team.findOne();

		// if (!section) {
		// 	section = new Team();
		// }
		const newHeaderImage = await saveAndDeleteImage(
			section.header.image,
			header.image,
			"team"
		);
		section.header.image = newHeaderImage;
		section.header.label = header.label || section.header.label;
		section.header.labelAr = header.labelAr || section.header.labelAr;
		section.title = title || section.title;
		section.paragraph = paragraph || section.paragraph;

		const updatedMembers = [];

		if (members) {
			const existingMemberIds = members.map((m) => m._id).filter(Boolean);

			const deletedMembers = await TeamMember.find({
				_id: { $nin: existingMemberIds },
			});

			for (const m of deletedMembers) {
				await deleteImage(m.image, "team");
			}

			await Team.updateMany(
				{ members: { $nin: existingMemberIds } },
				{ $pull: { members: { $in: deletedMembers.map((m) => m._id) } } }
			);
			await TeamMember.deleteMany({
				_id: { $nin: existingMemberIds },
			});

			// const highestOrder =
			// 	(await TeamMember.findOne().sort("-order").exec())?.order || 0;

			for (let i = 0; i < members.length; i++) {
				if (members[i]._id) {
					const existingMember = await TeamMember.findById(members[i]._id);

					existingMember.name = members[i]?.name || existingMember.name;
					existingMember.bio = members[i]?.bio || existingMember.bio;
					existingMember.role = members[i]?.role || existingMember.role;
					existingMember.nameAr = members[i]?.nameAr || existingMember.nameAr;
					existingMember.bioAr = members[i]?.bioAr || existingMember.bioAr;
					existingMember.roleAr = members[i]?.roleAr || existingMember.roleAr;
					existingMember.order = members[i]?.order || existingMember.order;

					const updatedMemberImage = await saveAndDeleteImage(
						existingMember.image,
						members[i].image,
						"team"
					);

					existingMember.image = updatedMemberImage;

					await existingMember.save();

					updatedMembers.push(existingMember);
				} else {
					const newImage = await saveAndDeleteImage(
						null,
						members[i].image,
						"team"
					);

					const newMember = await TeamMember.create({
						name: members[i].name,
						bio: members[i].bio,
						role: members[i].role,
						nameAr: members[i].nameAr,
						bioAr: members[i].bioAr,
						roleAr: members[i].roleAr,
						image: newImage,
						order: members[i].order,
					});

					updatedMembers.push(newMember);
				}
			}
		}

		section.members = updatedMembers;
		const updatedTeam = await section.save();

		return res.status(200).json({
			status: "success",
			result: updatedTeam,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError(`Something went wrong: ${error.message}`, 500));
	}
};
// exports.updateTeamSection = async (req, res, next) => {
// 	try {
// 		const { id } = req.params;

// 		const { header, members } = req.body;

// 		let section;

// 		if (id) {
// 			section = await Team.findById(id);
// 		} else {
// 			section = new Team();
// 		}

// 		const update = {
// 			$set: {
// 				header: {
// 					label: header?.label,
// 					labelAr: header?.labelAr,
// 					image: await saveAndDeleteImage(
// 						section ? section.header.image : null,
// 						header?.image,
// 						"team"
// 					),
// 				},
// 			},
// 		};

// 		const options = {
// 			upsert: true,
// 			new: true,
// 		};

// 		const result = await Team.findOneAndUpdate(
// 			{ _id: section._id },
// 			update,
// 			options
// 		);

// 		const updatedMembers = [];

// 		for (const member of members) {
// 			let oldMember;
// 			if (member._id) {
// 				oldMember = await TeamMember.findById(member._id);
// 			} else {
// 				oldMember = new TeamMember();
// 			}

// 			const updatedMember = await TeamMember.findByIdAndUpdate(
// 				{
// 					_id: oldMember._id,
// 				},
// 				{
// 					$set: {
// 						name: member?.name,
// 						nameAr: member?.nameAr,
// 						role: member?.role,
// 						roleAr: member?.roleAr,
// 						bio: member?.bio,
// 						bioAr: member?.bioAr,
// 						image: await saveAndDeleteImage(
// 							oldMember ? oldMember.image : null,
// 							member.image,
// 							"team"
// 						),
// 					},
// 				},
// 				options
// 			);

// 			updatedMembers.push(updatedMember);
// 		}

// 		result.members = updatedMembers;
// 		await result.save();

// 		return res.status(200).json({
// 			status: "success",
// 			result: result,
// 			success: true,
// 			message: "Section updated",
// 		});
// 	} catch (error) {
// 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// 	}
// };

exports.getTeamSection = async (req, res, next) => {
	try {
		const updateTeam = await Team.find({}).populate("members").lean();

		if (updateTeam.length === 0) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const section = updateTeam[0];

		section.header.image = `${res.locals.baseUrl}/uploads/cms/team/${section.header.image}`;

		const headerLabel =
			req.lang === "ar" ? section.header.labelAr : section.header.label;

		section.members.sort((a, b) => a.order - b.order);

		section.members = section.members.map((member) => {
			return {
				_id: member._id,
				name: req.lang === "ar" ? member.nameAr : member.name,
				role: req.lang === "ar" ? member.roleAr : member.role,
				bio: req.lang === "ar" ? member.bioAr : member.bio,
				image: `${res.locals.baseUrl}/uploads/cms/team/${member.image}`,
				order: member.order,
			};
		});

		return res.status(200).json({
			status: "success",
			result: {
				header: {
					image: section.header.image,
					label: headerLabel,
				},
				members: section.members,
				title: section.title,
				paragraph: section.paragraph,
			},
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

// exports.updateTeamMemberOrder = async (req, res, next) => {
// 	const { memberId, newOrder } = req.body;

// 	if (!memberId || newOrder === undefined) {
// 		return res.status(400).json({
// 			status: "fail",
// 			message: "Member ID and new order must be provided",
// 		});
// 	}

// 	try {
// 		const targetMember = await TeamMember.findById(memberId);

// 		if (!targetMember) {
// 			return res.status(404).json({
// 				status: "fail",
// 				message: "Member not found",
// 			});
// 		}

// 		const oldOrder = targetMember.order;

// 		if (newOrder < oldOrder) {
// 			if (newOrder + 1 === oldOrder) {
// 				await TeamMember.updateOne(
// 					{ order: newOrder },
// 					{ $set: { order: oldOrder } }
// 				);
// 			} else {
// 				await TeamMember.updateMany(
// 					{ order: { $gte: newOrder, $lt: oldOrder } },
// 					{ $inc: { order: 1 } }
// 				);
// 			}
// 		} else if (newOrder > oldOrder) {
// 			if (newOrder - 1 === oldOrder) {
// 				await TeamMember.updateOne(
// 					{ order: newOrder },
// 					{ $set: { order: oldOrder } }
// 				);
// 			} else {
// 				await TeamMember.updateMany(
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
// 			message: "Team Member order updated successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// 	}
// };

const {
	Home,
	Statistics,
	TimeLine,
	TimeLineHeader,
	Industry,
	Partner,
	HomeHeader,
	Message,
	About,
} = require("../../models/CMS/HomeModel");
const { Image } = require("../../models/CMS/whowheareModel");

const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage, deleteImage } = require("../../util/imagesUtility");
const { saveAndDeleteFile } = require("../../util/videoUtility");
const { host } = require("../../constants/host");

exports.updateHome = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { header, statistics, timeLine, industries, partners } = req.body;

		let section;

		if (id) {
			section = await Home.findById(id);
		} else {
			section = new Home();
		}

		const options = {
			upsert: true,
			new: true,
		};

		const updatedHeaders = [];
		for (const h of header) {
			let oldHeader;
			if (h._id) {
				oldHeader = await HomeHeader.findById(h._id);
			} else {
				oldHeader = new HomeHeader();
			}

			const existingHeader = await HomeHeader.findOneAndUpdate(
				{
					_id: oldHeader._id,
				},
				{
					$set: {
						label: h?.label,
						labelAr: h?.labelAr,
						image: await saveAndDeleteImage(
							oldHeader ? oldHeader.image : null,
							h.image,
							"home"
						),
					},
				},
				options
			);

			updatedHeaders.push(existingHeader);
		}

		const updatedStatistics = [];
		for (const s of statistics) {
			let oldStatistic;
			if (s._id) {
				oldStatistic = await Statistics.findById(s._id);
			} else {
				oldStatistic = new Statistics();
			}

			const existingStatisic = await Statistics.findOneAndUpdate(
				{
					_id: oldStatistic._id,
				},
				{
					$set: {
						label: s?.label,
						labelAr: s?.labelAr,
						value: s?.value,
						valueAr: s?.valueAr,
					},
				},
				options
			);

			updatedStatistics.push(existingStatisic);
		}

		const updatedTimeLine = [];
		for (const t of timeLine) {
			let oldTimLine;
			if (t._id) {
				oldTimLine = await TimeLine.findById(t._id);
			} else {
				oldTimLine = new TimeLine();
			}

			const existingTimeLine = await TimeLine.findOneAndUpdate(
				{
					_id: oldTimLine._id,
				},
				{
					$set: {
						label: t?.label,
						labelAr: t?.labelAr,
						year: t?.year,
						yearAr: t?.yearAr,
						image: await saveAndDeleteImage(
							oldTimLine ? oldTimLine.image : null,
							t?.image,
							"home"
						),
					},
				},
				options
			);

			updatedTimeLine.push(existingTimeLine);
		}

		const updatedIndustries = [];
		for (const i of industries) {
			let oldIndustry;
			if (i._id) {
				oldIndustry = await Industry.findById(i._id);
			} else {
				oldIndustry = new Industry();
			}

			const existingIndustry = await Industry.findOneAndUpdate(
				{
					_id: oldIndustry._id,
				},
				{
					$set: {
						label: i?.label,
						labelAr: i?.labelAr,
						link: i?.link,
						image: await saveAndDeleteImage(
							oldIndustry ? oldIndustry.image : null,
							i?.image,
							"home"
						),
					},
				},
				options
			);

			updatedIndustries.push(existingIndustry);
		}

		const updatedPartners = [];
		for (const p of partners) {
			let oldPartner;
			if (p._id) {
				oldPartner = await Partner.findById(p._id);
			} else {
				oldPartner = new Partner();
			}

			const existingPartner = await Partner.findOneAndUpdate(
				{
					_id: oldPartner._id,
				},
				{
					$set: {
						image: await saveAndDeleteImage(
							oldPartner ? oldPartner.image : null,
							p?.image,
							"home"
						),
					},
				},
				options
			);

			updatedPartners.push(existingPartner);
		}

		const result = await Home.findOneAndUpdate(
			{ _id: section._id },
			{
				header: updatedHeaders,
				statistics: updatedStatistics,
				timeLine: updatedTimeLine,
				industries: updatedIndustries,
				partners: updatedPartners,
			},
			options
		);

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

// exports.updateHomeHeader = async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const { label, labelAr, image, video } = req.body;

// 		let section;

// 		const options = {
// 			upsert: true,
// 			new: true,
// 		};

// 		if (id) {
// 			section = await HomeHeader.findById(id);
// 		} else {
// 			section = new HomeHeader();
// 		}

// 		const result = await HomeHeader.findOneAndUpdate(
// 			{
// 				_id: section._id,
// 			},
// 			{
// 				$set: {
// 					label,
// 					labelAr,
// 					image: await saveAndDeleteImage(
// 						section ? section.image : null,
// 						image,
// 						"home"
// 					),
// 					video: await saveAndDeleteFile(
// 						section ? section.video : null,
// 						video,
// 						"home"
// 					),
// 				},
// 			},
// 			options
// 		);
// 		await result.save();

// 		return res.status(200).json({
// 			status: "success",
// 			result: result,
// 			success: true,
// 			message: "Section updated",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

exports.updateHomeHeader = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { label, labelAr, image, video } = req.body;

		let section;

		const options = {
			upsert: true,
			new: true,
		};

		if (id) {
			section = await HomeHeader.findById(id);
		} else {
			section = new HomeHeader();
		}

		const updatedFields = {
			label,
			labelAr,
		};

		if (image) {
			updatedFields.image = await saveAndDeleteImage(
				section ? section.image : null,
				image,
				"home"
			);
			updatedFields.video = null;
			if (section) await deleteImage(section.video, "home");
		}

		if (video) {
			updatedFields.video = await saveAndDeleteFile(
				section ? section.video : null,
				video,
				"home"
			);
			updatedFields.image = null;
			if (section) await deleteImage(section.image, "home");
		}

		const result = await HomeHeader.findOneAndUpdate(
			{ _id: section._id },
			{ $set: updatedFields },
			options
		);

		return res.status(200).json({
			status: "success",
			result,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

exports.deleteHomeHeader = async (req, res, next) => {
	try {
		const { id } = req.params;

		const deletedHomeHeader = await HomeHeader.findById(id);

		if (deletedHomeHeader.image)
			await deleteImage(deletedHomeHeader.image, "home");

		if (deletedHomeHeader.video)
			await deleteImage(deletedHomeHeader.video, "home");

		await HomeHeader.findByIdAndDelete(id);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "Section Deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateStatistics = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { label, labelAr, value, valueAr, image } = req.body;

		let section;

		const options = {
			upsert: true,
			new: true,
		};

		if (id) {
			section = await Statistics.findById(id);
		} else {
			section = new Statistics();
		}

		const result = await Statistics.findOneAndUpdate(
			{
				_id: section._id,
			},
			{
				$set: {
					label,
					labelAr,
					value,
					valueAr,
					image: await saveAndDeleteImage(
						section ? section.image : null,
						image,
						"home"
					),
				},
			},
			options
		);

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteHomeStatistics = async (req, res, next) => {
	try {
		const { id } = req.params;

		const stat = await Statistics.findById(id);

		await deleteImage(stat.image, "home");

		await Statistics.findByIdAndDelete(id);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "Section Deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateTimeLine = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { label, labelAr, year, yearAr, image } = req.body;

		let section;

		const options = {
			upsert: true,
			new: true,
		};

		if (id) {
			section = await TimeLine.findById(id);
		} else {
			section = new TimeLine();
		}

		const result = await TimeLine.findOneAndUpdate(
			{
				_id: section._id,
			},
			{
				$set: {
					label,
					labelAr,
					year,
					yearAr,
					image: await saveAndDeleteImage(
						section ? section.image : null,
						image,
						"home"
					),
				},
			},
			options
		);

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteHomeTimeLine = async (req, res, next) => {
	try {
		const { id } = req.params;

		const deletedTImeLine = await TimeLine.findById(id);

		await deleteImage(deletedTImeLine.image, "home");

		await TimeLine.findByIdAndDelete(id);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "Section Deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateIndustry = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { label, labelAr, link, image } = req.body;

		let section;

		const options = {
			upsert: true,
			new: true,
		};

		if (id) {
			section = await Industry.findById(id);
		} else {
			section = new Industry();
		}

		const result = await Industry.findOneAndUpdate(
			{
				_id: section._id,
			},
			{
				$set: {
					label,
					labelAr,
					link,
					image: await saveAndDeleteImage(
						section ? section.image : null,
						image,
						"home"
					),
				},
			},
			options
		);

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteHomeIndustry = async (req, res, next) => {
	try {
		const { id } = req.params;

		const deletedIndustry = await Industry.findById(id);

		await deleteImage(deletedIndustry.image, "home");

		await Industry.findByIdAndDelete(id);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "Section Deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updatePartner = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { image, order } = req.body;

		let section;

		const options = {
			upsert: true,
			new: true,
		};

		if (id) {
			section = await Partner.findById(id);
		} else {
			section = new Partner();
		}

		// const highestOrder =
		// 	(await Partner.findOne().sort("-order").exec())?.order || 0;

		// const newOrder = section.isNew ? highestOrder + 1 : section.order;

		const result = await Partner.findOneAndUpdate(
			{
				_id: section._id,
			},
			{
				$set: {
					image: await saveAndDeleteImage(
						section ? section.image : null,
						image,
						"home"
					),
					order,
				},
			},
			options
		);

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteHomePartner = async (req, res, next) => {
	try {
		const { id } = req.params;

		const deletedPartner = await Partner.findById(id);

		await deleteImage(deletedPartner.image, "home");

		await Partner.findByIdAndDelete(id);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "Section Deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateMessage = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { name, nameAr, content, contentAr, image } = req.body;

		let section;

		const options = {
			upsert: true,
			new: true,
		};

		if (id) {
			section = await Message.findById(id);
		} else {
			section = new Message();
		}

		const result = await Message.findOneAndUpdate(
			{
				_id: section._id,
			},
			{
				$set: {
					name,
					nameAr,
					content,
					contentAr,
					image: await saveAndDeleteImage(
						section ? section.image : null,
						image,
						"home"
					),
				},
			},
			options
		);

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateAboutMessage = async (req, res, next) => {
	try {
		const { id } = req.params;

		const { title, titleAr, content, contentAr, images } = req.body;

		let section;

		if (id) {
			section = await About.findById(id);
		} else {
			section = new About();
		}

		const options = {
			upsert: true,
			new: true,
		};

		const update = {
			$set: {
				title: title,
				titleAr: titleAr,
				content: content,
				contentAr: contentAr,
			},
		};

		const result = await About.findOneAndUpdate(
			{ _id: section._id },
			update,
			options
		).exec();

		const updateImages = [];
		for (let i = 0; i < images.length; i++) {
			let oldImage;
			if (images[i]._id) {
				oldImage = await Image.findById(images[i]._id);
			} else {
				oldImage = new Image();
			}

			const existingImage = await Image.findOneAndUpdate(
				{ _id: oldImage._id },
				{
					$set: {
						image: await saveAndDeleteImage(
							oldImage ? oldImage.image : null,
							images[i].image,
							"home"
						),
					},
				},
				options
			).exec();

			updateImages.push(existingImage);
		}

		result.images = updateImages;

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section updated successfully",
		});
	} catch (error) {
		next(new ApiError(`Something went wrong: ${error.message}`, 500));
	}
};

exports.getAboutMessage = async (req, res, next) => {
	try {
		const section = await About.findOne({}).populate("images").lean();

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const title = req.lang === "ar" ? section.titleAr : section.title;
		const content = req.lang === "ar" ? section.contentAr : section.content;

		const images = section.images.map((image) => ({
			_id: image._id,
			image: `${res.locals.baseUrl}/uploads/cms/home/${image.image}`,
		}));

		return res.status(200).json({
			status: "success",
			result: {
				title,
				content,
				images,
			},
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

exports.getHome = async (req, res, next) => {
	try {
		const section = await Home.findOne()
			.populate("header statistics timeLine industries partners")
			.lean();

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		section.header = section.header.map((header) => {
			return {
				_id: header._id,
				label: header.label,
				labelAr: header.labelAr,
				image: `${res.locals.baseUrl}/uploads/cms/home/${header.image}`,
			};
		});

		section.timeLine = section.timeLine.map((t) => {
			return {
				_id: t._id,
				year: t.year,
				yearAr: t.yearAr,
				label: t.label,
				labelAr: t.labelAr,
				image: `${res.locals.baseUrl}/uploads/cms/home/${t.image}`,
			};
		});

		section.industries = section.industries.map((s) => {
			return {
				_id: s._id,
				label: s.label,
				labelAr: s.labelAr,
				link: s.link,
				image: `${res.locals.baseUrl}/uploads/cms/home/${s.image}`,
			};
		});

		section.partners = section.partners.map((p) => {
			return {
				_id: p._id,
				image: `${res.locals.baseUrl}/uploads/cms/home/${p.image}`,
			};
		});

		return res.status(200).json({
			status: "success",
			result: section,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getHomeHeader = async (req, res, next) => {
	try {
		let section = await HomeHeader.find({});

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		section = section.map((header) => {
			return {
				_id: header._id,
				label: header.label,
				labelAr: header.labelAr,
				image: header.image
					? `${res.locals.baseUrl}/uploads/cms/home/${header.image}`
					: null,
				video: header.video
					? `${res.locals.baseUrl}/uploads/cms/home/${header.video}`
					: null,
			};
		});

		return res.status(200).json({
			status: "success",
			result: section,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getTimeLine = async (req, res, next) => {
	try {
		let section = await TimeLine.find({}).sort({ year: 1 });

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		section = section.map((t) => {
			return {
				_id: t._id,
				year: t.year,
				yearAr: t.yearAr,
				label: t.label,
				labelAr: t.labelAr,
				image: `${res.locals.baseUrl}/uploads/cms/home/${t.image}`,
			};
		});

		return res.status(200).json({
			status: "success",
			result: section,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getIndustry = async (req, res, next) => {
	try {
		let section = await Industry.find({});

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		section = section.map((s) => {
			return {
				_id: s._id,
				label: s.label,
				labelAr: s.labelAr,
				link: s.link,
				image: `${res.locals.baseUrl}/uploads/cms/home/${s.image}`,
			};
		});

		return res.status(200).json({
			status: "success",
			result: section,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getPartner = async (req, res, next) => {
	try {
		let section = await Partner.find({}).sort({ order: 1 });

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		section = section.map((p) => {
			return {
				_id: p._id,
				image: `${res.locals.baseUrl}/uploads/cms/home/${p.image}`,
				order: p.order,
			};
		});

		return res.status(200).json({
			status: "success",
			result: section,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getStatistics = async (req, res, next) => {
	try {
		const section = await Statistics.find({});

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const formattedStatistics = section.map((s) => {
			return {
				_id: s._id,
				label: s.label,
				labelAr: s.labelAr,
				value: s.value,
				valueAr: s.valueAr,
				image: `${res.locals.baseUrl}/uploads/cms/home/${s.image}`,
			};
		});

		return res.status(200).json({
			status: "success",
			result: formattedStatistics,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getMessage = async (req, res, next) => {
	try {
		let section = await Message.findOne();

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		section.image = `${res.locals.baseUrl}/uploads/cms/home/${section.image}`;

		return res.status(200).json({
			status: "success",
			result: section,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// exports.createTimeLineHeader = async (req, res, next) => {
// 	try {
// 		const exisitingHeader = await TimeLineHeader.find({});

// 		if (exisitingHeader.length > 0) {
// 			return res.status(400).json({
// 				status: "fail",
// 				result: null,
// 				success: false,
// 				message: "Already there is Header",
// 			});
// 		}

// 		const newTimeLineHeader = await TimeLineHeader.create(req.body);

// 		return res.status(201).json({
// 			status: "success",
// 			result: newTimeLineHeader,
// 			success: true,
// 			message: "Timeline header created successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

exports.updateTimeLineHeader = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, paragraph, titleAr, paragraphAr } = req.body;

		let section;

		if (id) {
			section = await TimeLineHeader.findById(id);
		} else {
			section = new TimeLineHeader();
		}

		const result = await TimeLineHeader.findOneAndUpdate(
			{ _id: section._id },
			{
				$set: {
					title,
					paragraph,
					titleAr,
					paragraphAr,
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
			message: "Timeline header updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getTimeLineHeader = async (req, res, next) => {
	try {
		const timeLineHeader = await TimeLineHeader.findOne();

		if (!timeLineHeader) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		return res.status(200).json({
			status: "success",
			result: timeLineHeader,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// exports.updatePartnerOrder = async (req, res, next) => {
// 	const { partnerId, newOrder } = req.body;

// 	if (!partnerId || newOrder === undefined) {
// 		return res.status(400).json({
// 			status: "fail",
// 			message: "Partner ID and new order must be provided",
// 		});
// 	}

// 	try {
// 		const targetMember = await Partner.findById(partnerId);

// 		if (!targetMember) {
// 			return res.status(404).json({
// 				status: "fail",
// 				message: "Partner not found",
// 			});
// 		}

// 		const oldOrder = targetMember.order;

// 		if (newOrder < oldOrder) {
// 			if (newOrder + 1 === oldOrder) {
// 				await Partner.updateOne(
// 					{ order: newOrder },
// 					{ $set: { order: oldOrder } }
// 				);
// 			} else {
// 				await Partner.updateMany(
// 					{ order: { $gte: newOrder, $lt: oldOrder } },
// 					{ $inc: { order: 1 } }
// 				);
// 			}
// 		} else if (newOrder > oldOrder) {
// 			if (newOrder - 1 === oldOrder) {
// 				await Partner.updateOne(
// 					{ order: newOrder },
// 					{ $set: { order: oldOrder } }
// 				);
// 			} else {
// 				await Partner.updateMany(
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
// 			message: "Partner order updated successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// 	}
// };

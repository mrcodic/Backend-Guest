const {
	WhoWeAre,
	Image,
	WhoWeAreTimeLine,
	WhoWeAreTimeLineHeader,
} = require("../../models/CMS/whowheareModel");
const { TimeLine, TimeLineHeader } = require("../../models/CMS/HomeModel");
const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage } = require("../../util/imagesUtility");
const { saveAndDeletePdf } = require("../../util/pdfUtility");
const { host } = require("../../constants/host");
const { findOneAndUpdate } = require("../../models/blogModel");

// exports.updateWhoWeAre = async (req, res, next) => {
// 	try {
// 		const {
// 			title,
// 			titleAr,
// 			content,
// 			contentAr,
// 			images,
// 			image,
// 			mission,
// 			vision,
// 		} = req.body;

// 		const section = await WhoWeAre.findOne();

// 		if (!section) {
// 			return res.status(404).json({
// 				status: "error",
// 				message: "WhoWeAre section not found",
// 			});
// 		}

// 		section.title = title || section.title;
// 		section.titleAr = titleAr || section.titleAr;
// 		section.content = content || section.content;
// 		section.contentAr = contentAr || section.contentAr;

// 		// const newMissonImage = await saveAndDeleteImage(
// 		// 	section.mission.image,
// 		// 	mission.image,
// 		// 	"whoweare"
// 		// );
// 		// section.mission.image = newMissonImage;

// 		// section.mission.label = mission.label || section.mission.label;
// 		// section.mission.labelAr = mission.labelAr || section.mission.labelAr;
// 		// section.mission.content = mission.content || section.mission.content;
// 		// section.mission.contentAr = mission.contentAr || section.mission.contentAr;

// 		// const newVisionImage = await saveAndDeleteImage(
// 		//   section.vision.image,
// 		//   vision.image,
// 		//   "whoweare"
// 		// );
// 		// section.vision.image = newVisionImage;

// 		// section.vision.label = vision.label || section.vision.label;
// 		// section.vision.labelAr = vision.labelAr || section.vision.labelAr;
// 		// section.vision.content = vision.content || section.vision.content;
// 		// section.vision.contentAr = vision.contentAr || section.vision.contentAr;

// 		const singleImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"whoweare"
// 		);
// 		section.image = singleImage;

// 		const updateImages = [];

// 		if (images && images.length > 0) {
// 			const existingImageIds = images.map((i) => i._id).filter(Boolean);
// 			await Image.deleteMany({
// 				_id: { $nin: existingImageIds },
// 			});
// 			for (let i = 0; i < images.length; i++) {
// 				if (images[i]._id) {
// 					const existingImage = await Image.findById(images[i]._id);
// 					const newImageData = images[i].image;

// 					const updatedImage = await saveAndDeleteImage(
// 						existingImage.image,
// 						newImageData,
// 						"whoweare"
// 					);
// 					existingImage.image = updatedImage;
// 					await existingImage.save();

// 					updateImages.push(existingImage);
// 				} else {
// 					const newImage = await saveAndDeleteImage(
// 						null,
// 						images[i].image,
// 						"whoweare"
// 					);
// 					const newImageObject = await Image.create({ image: newImage });
// 					updateImages.push(newImageObject);
// 				}
// 			}
// 		}

// 		section.images = updateImages;
// 		const updatedSection = await section.save();

// 		return res.status(200).json({
// 			status: "success",
// 			result: updatedSection,
// 			success: true,
// 			message: "section updated successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// 	}
// };

exports.updateWhoWeAre = async (req, res, next) => {
	try {
		const { id } = req.params;

		const {
			title,
			titleAr,
			content,
			contentAr,
			sliderImages,
			images,
			mission,
			vision,
			companyPDF,
		} = req.body;

		let section;

		if (id) {
			section = await WhoWeAre.findById(id);
		} else {
			section = new WhoWeAre();
		}

		const update = {
			$set: {
				title: title,
				titleAr: titleAr,
				content: content,
				contentAr: contentAr,
				mission: {
					label: mission.label,
					labelAr: mission.labelAr,
					content: mission.content,
					contentAr: mission.contentAr,
					image: await saveAndDeleteImage(
						section ? section.mission.image : null,
						mission.image,
						"whoweare"
					),
				},
				vision: {
					label: vision.label,
					labelAr: vision.labelAr,
					content: vision.content,
					contentAr: vision.contentAr,
					image: await saveAndDeleteImage(
						section ? section.vision.image : null,
						vision.image,
						"whoweare"
					),
				},
				companyPDF: await saveAndDeletePdf(
					section ? section.companyPDF : null,
					companyPDF,
					"whoweare"
				),
			},
		};

		const options = {
			upsert: true,
			new: true,
		};

		const result = await WhoWeAre.findOneAndUpdate(
			{ _id: section._id },
			update,
			options
		).exec();

		const updateSliderImages = [];
		if (sliderImages && sliderImages.length > 0) {
			for (let i = 0; i < sliderImages.length; i++) {
				let oldImage;
				if (sliderImages[i]._id) {
					oldImage = await Image.findById(sliderImages[i]._id);
				} else {
					oldImage = new Image();
				}

				const existingImage = await Image.findOneAndUpdate(
					{ _id: oldImage._id },
					{
						$set: {
							image: await saveAndDeleteImage(
								oldImage ? oldImage.image : null,
								sliderImages[i].image,
								"whoweare"
							),
						},
					},
					options
				).exec();

				updateSliderImages.push(existingImage);
			}
		}

		result.sliderImages = updateSliderImages;

		const updateImages = [];
		if (images && images.length > 0) {
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
								"whoweare"
							),
						},
					},
					options
				).exec();

				updateImages.push(existingImage);
			}
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

exports.updateWhoWeAreTimeLine = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { year, yearAr, label, labelAr, image } = req.body;

		let section;

		if (id) {
			section = await WhoWeAreTimeLine.findById(id);
		} else {
			section = new WhoWeAreTimeLine();
		}

		const update = {
			$set: {
				year,
				yearAr,
				label,
				labelAr,
				image: await saveAndDeleteImage(
					section ? section.image : null,
					image,
					"whoweare"
				),
			},
		};

		const options = {
			upsert: true,
			new: true,
		};

		const result = await WhoWeAreTimeLine.findOneAndUpdate(
			{ _id: section._id },
			update,
			options
		).exec();

		await result.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Section Time Line updated successfully",
		});
	} catch (error) {
		next(new ApiError(`Something went wrong: ${error.message}`, 500));
	}
};

exports.getWhoWeAreTimeLine = async (req, res, next) => {
	try {
		const timeLine = await WhoWeAreTimeLine.find({}).sort({ year: 1 });

		if (timeLine.length === 0) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const formattedTimeline = timeLine.map((item) => ({
			_id: item._id,
			image: `${res.locals.baseUrl}/uploads/cms/whoweare/${item.image}`,
			label: req.lang === "ar" ? item.labelAr : item.label,
			year: req.lang === "ar" ? item.yearAr : item.year,
		}));

		return res.status(200).json({
			status: "success",
			result: formattedTimeline,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

exports.getWhoAre = async (req, res, next) => {
	try {
		const section = await WhoWeAre.findOne({})
			.populate("images sliderImages")
			.lean();

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const images = section.images.map((img) => {
			return {
				_id: img._id,
				image: `${res.locals.baseUrl}/uploads/cms/whoweare/${img.image}`,
			};
		});
		const sliderImages = section.sliderImages.map((img) => {
			return {
				_id: img._id,
				image: `${res.locals.baseUrl}/uploads/cms/whoweare/${img.image}`,
			};
		});

		const responseData = {
			_id: section._id,
			title: req.lang === "ar" ? section.titleAr : section.title,
			content: req.lang === "ar" ? section.contentAr : section.content,
			images,
			sliderImages,
			mission: {
				image: `${res.locals.baseUrl}/uploads/cms/whoweare/${section.mission.image}`,
				label:
					req.lang === "ar" ? section.mission.labelAr : section.mission.label,
				content:
					req.lang === "ar"
						? section.mission.contentAr
						: section.mission.content,
			},
			vision: {
				image: `${res.locals.baseUrl}/uploads/cms/whoweare/${section.vision.image}`,
				label:
					req.lang === "ar" ? section.vision.labelAr : section.vision.label,
				content:
					req.lang === "ar" ? section.vision.contentAr : section.vision.content,
			},
			companyPDF: `${res.locals.baseUrl}/uploads/cms/whoweare/${section.companyPDF}`,
		};

		const timeLineHeader = await WhoWeAreTimeLineHeader.findOne();

		responseData.timeLineHeader = {
			title: req.lang === "ar" ? timeLineHeader.titleAr : timeLineHeader.title,
			paragraph:
				req.lang === "ar"
					? timeLineHeader.paragraphAr
					: timeLineHeader.paragraph,
		};

		const timeLine = await WhoWeAreTimeLine.find({}).sort({ year: 1 });

		const formattedTimeline = timeLine.map((item) => ({
			_id: item._id,
			image: `${res.locals.baseUrl}/uploads/cms/whoweare/${item.image}`,
			label: req.lang === "ar" ? item.labelAr : item.label,
			year: req.lang === "ar" ? item.yearAr : item.year,
		}));

		responseData.timeline = formattedTimeline;

		return res.status(200).json({
			status: "success",
			result: responseData,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

exports.updateWhoWeAreTimeLineHeader = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, paragraph, titleAr, paragraphAr } = req.body;

		let section;

		if (id) {
			section = await WhoWeAreTimeLineHeader.findById(id);
		} else {
			section = new WhoWeAreTimeLineHeader();
		}

		const result = await WhoWeAreTimeLineHeader.findOneAndUpdate(
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

exports.getWhoWeAreTimeLineHeader = async (req, res, next) => {
	try {
		const timeLineHeader = await WhoWeAreTimeLineHeader.findOne();

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

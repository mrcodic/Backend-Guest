const { host } = require("../../constants/host");
const { Gallery, ImageGallery } = require("../../models/CMS/GalleryModel");
const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage, deleteImage } = require("../../util/imagesUtility");

exports.updateGallery = async (req, res, next) => {
	try {
		const { header, gallery } = req.body;

		const section = await Gallery.findOne();

		const newHeaderImage = await saveAndDeleteImage(
			section.header.image,
			header.image,
			"gallery"
		);
		section.header.image = newHeaderImage;
		section.header.label = header?.label || section.header.label;
		section.header.labelAr = header?.labelAr || section.header.labelAr;

		const updatedImageGallery = [];

		if (gallery && gallery.length > 0) {
			const existingGalleryIds = gallery.map((g) => g._id).filter(Boolean);

			const deletedImages = await ImageGallery.find({
				_id: { $nin: existingGalleryIds },
			});

			for (const g of deletedImages) {
				await deleteImage(g.image, "gallery");
			}
			await Gallery.updateMany(
				{ gallery: { $nin: existingGalleryIds } },
				{ $pull: { gallery: { $in: deletedImages.map((image) => image._id) } } }
			);
			await ImageGallery.deleteMany({
				_id: { $nin: existingGalleryIds },
			});

			for (let i = 0; i < gallery.length; i++) {
				const imageData = gallery[i];
				if (imageData._id) {
					const existingImage = await ImageGallery.findById(imageData._id);
					const { category, image, label, title, link, labelAr, titleAr } =
						imageData;

					const updatedImage = await saveAndDeleteImage(
						existingImage.image,
						image,
						"gallery"
					);

					existingImage.image = updatedImage;
					existingImage.category = category || existingImage.category;
					existingImage.label = label || existingImage.label;
					existingImage.title = title || existingImage.title;
					existingImage.labelAr = labelAr || existingImage.labelAr;
					existingImage.titleAr = titleAr || existingImage.titleAr;
					existingImage.link = link || existingImage.link;

					await existingImage.save();

					updatedImageGallery.push(existingImage);
				} else {
					const { category, image, label, title, link, labelAr, titleAr } =
						imageData;

					const newImage = await saveAndDeleteImage(null, image, "gallery");

					const newImageGallery = await ImageGallery.create({
						category,
						label,
						title,
						link,
						labelAr,
						titleAr,
						image: newImage,
					});

					updatedImageGallery.push(newImageGallery);
				}
			}
		}

		section.gallery = updatedImageGallery;
		const updatedSection = await section.save();

		return res.status(200).json({
			status: "success",
			result: updatedSection,
			success: true,
			message: "Section updated",
		});
	} catch (error) {
		next(new ApiError(`Something went wrong: ${error.message}`, 500));
	}
};
// exports.updateGallery = async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const { header, gallery } = req.body;

// 		let section;

// 		if (id) {
// 			section = await Gallery.findById(id);
// 		} else {
// 			section = new Gallery();
// 		}

// 		const update = {
// 			$set: {
// 				header: {
// 					label: header?.label,
// 					labelAr: header?.labelAr,
// 					image: await saveAndDeleteImage(
// 						section ? section.header.image : null,
// 						header.image,
// 						"gallery"
// 					),
// 				},
// 			},
// 		};

// 		const options = {
// 			upsert: true,
// 			new: true,
// 		};

// 		const result = await Gallery.findOneAndUpdate(
// 			{ _id: section._id },
// 			update,
// 			options
// 		);

// 		const updatedGallery = [];
// 		for (const image of gallery) {
// 			let oldImage;
// 			if (image._id) {
// 				oldImage = await ImageGallery.findById(image._id);
// 			} else {
// 				oldImage = new ImageGallery();
// 			}

// 			const updatedImage = await ImageGallery.findOneAndUpdate(
// 				{
// 					_id: oldImage._id,
// 				},
// 				{
// 					$set: {
// 						category: image?.category,
// 						categoryAr: image?.categoryAr,
// 						label: image?.label,
// 						labelAr: image?.labelAr,
// 						title: image?.title,
// 						titleAr: image?.titleAr,
// 						link: image?.link,
// 						image: await saveAndDeleteImage(
// 							oldImage ? oldImage.image : null,
// 							image.image,
// 							"gallery"
// 						),
// 					},
// 				},
// 				options
// 			);

// 			updatedGallery.push(updatedImage);
// 		}

// 		result.gallery = updatedGallery;
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

exports.getGallery = async (req, res, next) => {
	try {
		const section = await Gallery.findOne({})
			.populate({
				path: "gallery",
				populate: {
					path: "category",
					select: req.lang === "ar" ? "nameAr" : "name",
				},
			})
			.lean();

		if (!section) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		section.header.image = `${res.locals.baseUrl}/uploads/cms/gallery/${section.header.image}`;

		section.gallery = section.gallery.map((gallery) => {
			let category = {};
			if (gallery.category) {
				category.name =
					req.lang === "ar" ? gallery.category.nameAr : gallery.category.name;
				category._id = gallery.category._id;
			}

			return {
				_id: gallery._id,
				category: category,
				label: req.lang === "ar" ? gallery.labelAr : gallery.label,
				title: req.lang === "ar" ? gallery.titleAr : gallery.title,
				link: gallery.link,
				image: `${res.locals.baseUrl}/uploads/cms/gallery/${gallery.image}`,
			};
		});

		const response = {
			header: {
				image: section.header.image,
				label:
					req.lang === "ar" ? section.header.labelAr : section.header.label,
			},
			gallery: section.gallery,
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

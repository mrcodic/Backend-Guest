// const { host } = require("../../constants/host");
const { CompanyList, Company } = require("../../models/CMS/CompanyListModel");
const ApiError = require("../../util/ApiError");
const { saveAndDeleteImage, deleteImage } = require("../../util/imagesUtility");
const { saveAndDeletePdf } = require("../../util/pdfUtility");

// const CompanyListObject = {
// 	AlKhaldiLogistics: "AlKhaldiLogistics",
// 	FuelWay: "FuelWay",
// 	AlkhaldiRealState: "AlkhaldiRealState",
// 	AlKhaldiBuilding: "AlKhaldiBuilding",
// 	AutoGulf: "AutoGulf",
// 	SaudiDrill: "SaudiDrill",
// 	SaudiaFalcon: "SaudiaFalcon",
// };

// const CompanyListArr = Object.keys(CompanyListObject);

// exports.updateCompanyList = async (req, res, next) => {
// 	try {
// 		const { id } = req.params;
// 		const { header } = req.body;
// 		delete req.body.header;
// 		const filteredCompanies = req.body;

// 		let section;

// 		if (id) {
// 			section = await CompanyList.findById(id);
// 		} else {
// 			section = new CompanyList();
// 		}

// 		const update = {
// 			$set: {
// 				header: {
// 					label: header?.label,
// 					labelAr: header?.labelAr,
// 					image: await saveAndDeleteImage(
// 						section ? section.header.image : null,
// 						header.image,
// 						"company"
// 					),
// 				},
// 			},
// 		};

// 		const options = {
// 			upsert: true,
// 			new: true,
// 		};

// 		const result = await CompanyList.findOneAndUpdate(
// 			{ _id: section._id },
// 			update,
// 			options
// 		).select("-header");

// 		for (const company of CompanyListArr) {
// 			const existingCompany = result[company];
// 			const companyObj = filteredCompanies[company];

// 			existingCompany.name = companyObj?.name || existingCompany.name;
// 			existingCompany.bio = companyObj?.bio || existingCompany.bio;
// 			existingCompany.nameAr = companyObj?.nameAr || existingCompany.nameAr;
// 			existingCompany.bioAr = companyObj?.bioAr || existingCompany.bioAr;
// 			existingCompany.website = companyObj?.website || existingCompany.website;

// 			const updatedCompanyImage = await saveAndDeleteImage(
// 				existingCompany.image,
// 				companyObj.image,
// 				"company"
// 			);
// 			existingCompany.image = updatedCompanyImage;

// 			const updatedSupportImage = await saveAndDeleteImage(
// 				existingCompany.supportImage,
// 				companyObj.supportImage,
// 				"company"
// 			);
// 			existingCompany.supportImage = updatedSupportImage;

// 			const updatedLogo = await saveAndDeleteImage(
// 				existingCompany.logo,
// 				companyObj.logo,
// 				"company"
// 			);

// 			existingCompany.logo = updatedLogo;

// 			const updatedBrochuresPdf = await saveAndDeletePdf(
// 				existingCompany.brochuresPdf,
// 				companyObj.brochuresPdf,
// 				"company"
// 			);
// 			existingCompany.brochuresPdf = updatedBrochuresPdf;

// 			const updatedDetailsPdf = await saveAndDeletePdf(
// 				existingCompany.detailsPdf,
// 				companyObj.detailsPdf,
// 				"company"
// 			);
// 			existingCompany.detailsPdf = updatedDetailsPdf;

// 			for (const [j, imageLabel] of existingCompany.imageWithLabel.entries()) {
// 				const updatedImage = await saveAndDeleteImage(
// 					imageLabel.image,
// 					companyObj.imageWithLabel[j]?.image,
// 					"company"
// 				);

// 				existingCompany.imageWithLabel[j].image = updatedImage;
// 				existingCompany.imageWithLabel[j].label =
// 					companyObj.imageWithLabel[j]?.label ||
// 					existingCompany.imageWithLabel[j].label;
// 				existingCompany.imageWithLabel[j].labelAr =
// 					companyObj.imageWithLabel[j]?.labelAr ||
// 					existingCompany.imageWithLabel[j].labelAr;
// 			}

// 			await result.save();
// 		}

// 		const updatedList = await section.save();

// 		return res.status(200).json({
// 			status: "success",
// 			result: updatedList,
// 			success: true,
// 			message: "Section updated",
// 		});
// 	} catch (error) {
// 		next(new ApiError(`Something went wrong: ${error.message}`, 500));
// 	}
// };

// exports.updateAlKhaldiLogistics = async (req, res, next) => {
// 	try {
// 		const {
// 			name,
// 			nameAr,
// 			bio,
// 			bioAr,
// 			website,
// 			image,
// 			supportImage,
// 			logo,
// 			brochuresPdf,
// 			detailsPdf,
// 			imageWithLabel,
// 		} = req.body;

// 		const list = await CompanyList.findOne().select("AlKhaldiLogistics");

// 		const section = list.AlKhaldiLogistics;

// 		section.name = name || section.name;
// 		section.bio = bio || section.bio;
// 		section.nameAr = nameAr || section.nameAr;
// 		section.bioAr = bioAr || section.bioAr;
// 		section.website = website || section.website;

// 		const updatedCompanyImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);
// 		section.image = updatedCompanyImage;

// 		const updatedSupportImage = await saveAndDeleteImage(
// 			section.supportImage,
// 			supportImage,
// 			"company"
// 		);
// 		section.supportImage = updatedSupportImage;

// 		const updatedLogo = await saveAndDeleteImage(section.logo, logo, "company");

// 		section.logo = updatedLogo;

// 		const updatedBrochuresPdf = await saveAndDeletePdf(
// 			section.brochuresPdf,
// 			brochuresPdf,
// 			"company"
// 		);
// 		section.brochuresPdf = updatedBrochuresPdf;

// 		const updatedDetailsPdf = await saveAndDeletePdf(
// 			section.detailsPdf,
// 			detailsPdf,
// 			"company"
// 		);
// 		section.detailsPdf = updatedDetailsPdf;

// 		for (const [j, imageLabel] of section.imageWithLabel.entries()) {
// 			const updatedImage = await saveAndDeleteImage(
// 				imageLabel.image,
// 				imageWithLabel[j]?.image,
// 				"company"
// 			);

// 			section.imageWithLabel[j].image = updatedImage;
// 			section.imageWithLabel[j].label =
// 				imageWithLabel[j]?.label || section.imageWithLabel[j].label;
// 			section.imageWithLabel[j].labelAr =
// 				imageWithLabel[j]?.labelAr || section.imageWithLabel[j].labelAr;
// 		}

// 		const updatedSection = await list.save();

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

// exports.updateAlKhaldiBuilding = async (req, res, next) => {
// 	try {
// 		const {
// 			name,
// 			nameAr,
// 			bio,
// 			bioAr,
// 			website,
// 			image,
// 			supportImage,
// 			logo,
// 			brochuresPdf,
// 			detailsPdf,
// 			imageWithLabel,
// 		} = req.body;

// 		const list = await CompanyList.findOne().select("AlKhaldiBuilding");

// 		const section = list.AlKhaldiBuilding;

// 		section.name = name || section.name;
// 		section.bio = bio || section.bio;
// 		section.nameAr = nameAr || section.nameAr;
// 		section.bioAr = bioAr || section.bioAr;
// 		section.website = website || section.website;

// 		const updatedCompanyImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);
// 		section.image = updatedCompanyImage;

// 		const updatedSupportImage = await saveAndDeleteImage(
// 			section.supportImage,
// 			supportImage,
// 			"company"
// 		);
// 		section.supportImage = updatedSupportImage;

// 		const updatedLogo = await saveAndDeleteImage(section.logo, logo, "company");

// 		section.logo = updatedLogo;

// 		const updatedBrochuresPdf = await saveAndDeletePdf(
// 			section.brochuresPdf,
// 			brochuresPdf,
// 			"company"
// 		);
// 		section.brochuresPdf = updatedBrochuresPdf;

// 		const updatedDetailsPdf = await saveAndDeletePdf(
// 			section.detailsPdf,
// 			detailsPdf,
// 			"company"
// 		);
// 		section.detailsPdf = updatedDetailsPdf;

// 		for (const [j, imageLabel] of section.imageWithLabel.entries()) {
// 			const updatedImage = await saveAndDeleteImage(
// 				imageLabel.image,
// 				imageWithLabel[j]?.image,
// 				"company"
// 			);

// 			section.imageWithLabel[j].image = updatedImage;
// 			section.imageWithLabel[j].label =
// 				imageWithLabel[j]?.label || section.imageWithLabel[j].label;
// 			section.imageWithLabel[j].labelAr =
// 				imageWithLabel[j]?.labelAr || section.imageWithLabel[j].labelAr;
// 		}

// 		const updatedSection = await list.save();

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
// exports.updateAlkhaldiRealState = async (req, res, next) => {
// 	try {
// 		const {
// 			name,
// 			nameAr,
// 			bio,
// 			bioAr,
// 			website,
// 			image,
// 			supportImage,
// 			logo,
// 			brochuresPdf,
// 			detailsPdf,
// 			imageWithLabel,
// 		} = req.body;

// 		const list = await CompanyList.findOne().select("AlkhaldiRealState");

// 		const section = list.AlkhaldiRealState;

// 		section.name = name || section.name;
// 		section.bio = bio || section.bio;
// 		section.nameAr = nameAr || section.nameAr;
// 		section.bioAr = bioAr || section.bioAr;
// 		section.website = website || section.website;

// 		const updatedCompanyImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);
// 		section.image = updatedCompanyImage;

// 		const updatedSupportImage = await saveAndDeleteImage(
// 			section.supportImage,
// 			supportImage,
// 			"company"
// 		);
// 		section.supportImage = updatedSupportImage;

// 		const updatedLogo = await saveAndDeleteImage(section.logo, logo, "company");

// 		section.logo = updatedLogo;

// 		const updatedBrochuresPdf = await saveAndDeletePdf(
// 			section.brochuresPdf,
// 			brochuresPdf,
// 			"company"
// 		);
// 		section.brochuresPdf = updatedBrochuresPdf;

// 		const updatedDetailsPdf = await saveAndDeletePdf(
// 			section.detailsPdf,
// 			detailsPdf,
// 			"company"
// 		);
// 		section.detailsPdf = updatedDetailsPdf;

// 		for (const [j, imageLabel] of section.imageWithLabel.entries()) {
// 			const updatedImage = await saveAndDeleteImage(
// 				imageLabel.image,
// 				imageWithLabel[j]?.image,
// 				"company"
// 			);

// 			section.imageWithLabel[j].image = updatedImage;
// 			section.imageWithLabel[j].label =
// 				imageWithLabel[j]?.label || section.imageWithLabel[j].label;
// 			section.imageWithLabel[j].labelAr =
// 				imageWithLabel[j]?.labelAr || section.imageWithLabel[j].labelAr;
// 		}

// 		const updatedSection = await list.save();

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
// exports.updateFuelWay = async (req, res, next) => {
// 	try {
// 		const {
// 			name,
// 			nameAr,
// 			bio,
// 			bioAr,
// 			website,
// 			image,
// 			supportImage,
// 			logo,
// 			brochuresPdf,
// 			detailsPdf,
// 			imageWithLabel,
// 		} = req.body;

// 		const list = await CompanyList.findOne().select("FuelWay");

// 		const section = list.FuelWay;

// 		section.name = name || section.name;
// 		section.bio = bio || section.bio;
// 		section.nameAr = nameAr || section.nameAr;
// 		section.bioAr = bioAr || section.bioAr;
// 		section.website = website || section.website;

// 		const updatedCompanyImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);
// 		section.image = updatedCompanyImage;

// 		const updatedSupportImage = await saveAndDeleteImage(
// 			section.supportImage,
// 			supportImage,
// 			"company"
// 		);
// 		section.supportImage = updatedSupportImage;

// 		const updatedLogo = await saveAndDeleteImage(section.logo, logo, "company");

// 		section.logo = updatedLogo;

// 		const updatedBrochuresPdf = await saveAndDeletePdf(
// 			section.brochuresPdf,
// 			brochuresPdf,
// 			"company"
// 		);
// 		section.brochuresPdf = updatedBrochuresPdf;

// 		const updatedDetailsPdf = await saveAndDeletePdf(
// 			section.detailsPdf,
// 			detailsPdf,
// 			"company"
// 		);
// 		section.detailsPdf = updatedDetailsPdf;

// 		for (const [j, imageLabel] of section.imageWithLabel.entries()) {
// 			const updatedImage = await saveAndDeleteImage(
// 				imageLabel.image,
// 				imageWithLabel[j]?.image,
// 				"company"
// 			);

// 			section.imageWithLabel[j].image = updatedImage;
// 			section.imageWithLabel[j].label =
// 				imageWithLabel[j]?.label || section.imageWithLabel[j].label;
// 			section.imageWithLabel[j].labelAr =
// 				imageWithLabel[j]?.labelAr || section.imageWithLabel[j].labelAr;
// 		}

// 		const updatedSection = await list.save();

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
// exports.updateAutoGulf = async (req, res, next) => {
// 	try {
// 		const {
// 			name,
// 			nameAr,
// 			bio,
// 			bioAr,
// 			website,
// 			image,
// 			supportImage,
// 			logo,
// 			brochuresPdf,
// 			detailsPdf,
// 			imageWithLabel,
// 		} = req.body;

// 		const list = await CompanyList.findOne().select("AutoGulf");

// 		const section = list.AutoGulf;

// 		section.name = name || section.name;
// 		section.bio = bio || section.bio;
// 		section.nameAr = nameAr || section.nameAr;
// 		section.bioAr = bioAr || section.bioAr;
// 		section.website = website || section.website;

// 		const updatedCompanyImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);
// 		section.image = updatedCompanyImage;

// 		const updatedSupportImage = await saveAndDeleteImage(
// 			section.supportImage,
// 			supportImage,
// 			"company"
// 		);
// 		section.supportImage = updatedSupportImage;

// 		const updatedLogo = await saveAndDeleteImage(section.logo, logo, "company");

// 		section.logo = updatedLogo;

// 		const updatedBrochuresPdf = await saveAndDeletePdf(
// 			section.brochuresPdf,
// 			brochuresPdf,
// 			"company"
// 		);
// 		section.brochuresPdf = updatedBrochuresPdf;

// 		const updatedDetailsPdf = await saveAndDeletePdf(
// 			section.detailsPdf,
// 			detailsPdf,
// 			"company"
// 		);
// 		section.detailsPdf = updatedDetailsPdf;

// 		for (const [j, imageLabel] of section.imageWithLabel.entries()) {
// 			const updatedImage = await saveAndDeleteImage(
// 				imageLabel.image,
// 				imageWithLabel[j]?.image,
// 				"company"
// 			);

// 			section.imageWithLabel[j].image = updatedImage;
// 			section.imageWithLabel[j].label =
// 				imageWithLabel[j]?.label || section.imageWithLabel[j].label;
// 			section.imageWithLabel[j].labelAr =
// 				imageWithLabel[j]?.labelAr || section.imageWithLabel[j].labelAr;
// 		}

// 		const updatedSection = await list.save();

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
// exports.updateSaudiDrill = async (req, res, next) => {
// 	try {
// 		const {
// 			name,
// 			nameAr,
// 			bio,
// 			bioAr,
// 			website,
// 			image,
// 			supportImage,
// 			logo,
// 			brochuresPdf,
// 			detailsPdf,
// 			imageWithLabel,
// 		} = req.body;

// 		const list = await CompanyList.findOne().select("SaudiDrill");

// 		const section = list.SaudiDrill;

// 		section.name = name || section.name;
// 		section.bio = bio || section.bio;
// 		section.nameAr = nameAr || section.nameAr;
// 		section.bioAr = bioAr || section.bioAr;
// 		section.website = website || section.website;

// 		const updatedCompanyImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);
// 		section.image = updatedCompanyImage;

// 		const updatedSupportImage = await saveAndDeleteImage(
// 			section.supportImage,
// 			supportImage,
// 			"company"
// 		);
// 		section.supportImage = updatedSupportImage;

// 		const updatedLogo = await saveAndDeleteImage(section.logo, logo, "company");

// 		section.logo = updatedLogo;

// 		const updatedBrochuresPdf = await saveAndDeletePdf(
// 			section.brochuresPdf,
// 			brochuresPdf,
// 			"company"
// 		);
// 		section.brochuresPdf = updatedBrochuresPdf;

// 		const updatedDetailsPdf = await saveAndDeletePdf(
// 			section.detailsPdf,
// 			detailsPdf,
// 			"company"
// 		);
// 		section.detailsPdf = updatedDetailsPdf;

// 		for (const [j, imageLabel] of section.imageWithLabel.entries()) {
// 			const updatedImage = await saveAndDeleteImage(
// 				imageLabel.image,
// 				imageWithLabel[j]?.image,
// 				"company"
// 			);

// 			section.imageWithLabel[j].image = updatedImage;
// 			section.imageWithLabel[j].label =
// 				imageWithLabel[j]?.label || section.imageWithLabel[j].label;
// 			section.imageWithLabel[j].labelAr =
// 				imageWithLabel[j]?.labelAr || section.imageWithLabel[j].labelAr;
// 		}

// 		const updatedSection = await list.save();

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
// exports.updateSaudiaFalcon = async (req, res, next) => {
// 	try {
// 		const {
// 			name,
// 			nameAr,
// 			bio,
// 			bioAr,
// 			website,
// 			image,
// 			supportImage,
// 			logo,
// 			brochuresPdf,
// 			detailsPdf,
// 			imageWithLabel,
// 		} = req.body;

// 		const list = await CompanyList.findOne().select("SaudiaFalcon");

// 		const section = list.SaudiaFalcon;

// 		section.name = name || section.name;
// 		section.bio = bio || section.bio;
// 		section.nameAr = nameAr || section.nameAr;
// 		section.bioAr = bioAr || section.bioAr;
// 		section.website = website || section.website;

// 		const updatedCompanyImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);
// 		section.image = updatedCompanyImage;

// 		const updatedSupportImage = await saveAndDeleteImage(
// 			section.supportImage,
// 			supportImage,
// 			"company"
// 		);
// 		section.supportImage = updatedSupportImage;

// 		const updatedLogo = await saveAndDeleteImage(section.logo, logo, "company");

// 		section.logo = updatedLogo;

// 		const updatedBrochuresPdf = await saveAndDeletePdf(
// 			section.brochuresPdf,
// 			brochuresPdf,
// 			"company"
// 		);
// 		section.brochuresPdf = updatedBrochuresPdf;

// 		const updatedDetailsPdf = await saveAndDeletePdf(
// 			section.detailsPdf,
// 			detailsPdf,
// 			"company"
// 		);
// 		section.detailsPdf = updatedDetailsPdf;

// 		for (const [j, imageLabel] of section.imageWithLabel.entries()) {
// 			const updatedImage = await saveAndDeleteImage(
// 				imageLabel.image,
// 				imageWithLabel[j]?.image,
// 				"company"
// 			);

// 			section.imageWithLabel[j].image = updatedImage;
// 			section.imageWithLabel[j].label =
// 				imageWithLabel[j]?.label || section.imageWithLabel[j].label;
// 			section.imageWithLabel[j].labelAr =
// 				imageWithLabel[j]?.labelAr || section.imageWithLabel[j].labelAr;
// 		}

// 		const updatedSection = await list.save();

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

// exports.updateCompaniesHeader = async (req, res, next) => {
// 	try {
// 		const { label, labelAr, image } = req.body;

// 		const list = await CompanyList.findOne().select("header");
// 		const section = list.header;

// 		section.label = label || section.label;
// 		section.labelAr = labelAr || section.labelAr;

// 		const updatedImage = await saveAndDeleteImage(
// 			section.image,
// 			image,
// 			"company"
// 		);

// 		section.image = updatedImage;

// 		const updatedSection = await list.save();

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

// exports.getCompanyList = async (req, res, next) => {
// 	try {
// 		const section = await CompanyList.findOne();

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.header.image = `${res.locals.baseUrl}/uploads/cms/company/${section.header.image}`;

// 		// const sectionWithoutHeader = await CompanyList.findOne().select("-header");

// 		const sectionWithoutHeader = await CompanyList.findOne().select(
// 			"-header -supportImage -detailsPdf -brochuresPdf"
// 		);

// 		for (const company of CompanyListArr) {
// 			sectionWithoutHeader[
// 				company
// 			].image = `${res.locals.baseUrl}/uploads/cms/company/${sectionWithoutHeader[company].image}`;

// 			sectionWithoutHeader[
// 				company
// 			].logo = `${res.locals.baseUrl}/uploads/cms/company/${sectionWithoutHeader[company].logo}`;

// 			sectionWithoutHeader[
// 				company
// 			].supportImage = `${res.locals.baseUrl}/uploads/cms/company/${sectionWithoutHeader[company].supportImage}`;

// 			sectionWithoutHeader[
// 				company
// 			].detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${sectionWithoutHeader[company].detailsPdf}`;

// 			sectionWithoutHeader[
// 				company
// 			].brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${sectionWithoutHeader[company].brochuresPdf}`;

// 			for (const imageLabel of sectionWithoutHeader[company].imageWithLabel) {
// 				imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 			}
// 		}

// 		return res.status(200).json({
// 			status: "success",
// 			result: {
// 				header: section.header,
// 				...sectionWithoutHeader._doc,
// 			},
// 			success: true,
// 			message: "success",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

// exports.getAlKhaldiLogistics = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("AlKhaldiLogistics");
// 		const section = list.AlKhaldiLogistics;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

// 		section.logo = `${res.locals.baseUrl}/uploads/cms/company/${section.logo}`;

// 		section.supportImage = `${res.locals.baseUrl}/uploads/cms/company/${section.supportImage}`;

// 		section.detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.detailsPdf}`;

// 		section.brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.brochuresPdf}`;

// 		for (const imageLabel of section.imageWithLabel) {
// 			imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 		}

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

// exports.getFuelWay = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("FuelWay");
// 		const section = list.FuelWay;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

// 		section.logo = `${res.locals.baseUrl}/uploads/cms/company/${section.logo}`;

// 		section.supportImage = `${res.locals.baseUrl}/uploads/cms/company/${section.supportImage}`;

// 		section.detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.detailsPdf}`;

// 		section.brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.brochuresPdf}`;

// 		for (const imageLabel of section.imageWithLabel) {
// 			imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 		}

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

// exports.getAlkhaldiRealState = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("AlkhaldiRealState");
// 		const section = list.AlkhaldiRealState;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

// 		section.logo = `${res.locals.baseUrl}/uploads/cms/company/${section.logo}`;

// 		section.supportImage = `${res.locals.baseUrl}/uploads/cms/company/${section.supportImage}`;

// 		section.detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.detailsPdf}`;

// 		section.brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.brochuresPdf}`;

// 		for (const imageLabel of section.imageWithLabel) {
// 			imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 		}

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

// exports.getAlKhaldiBuilding = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("AlKhaldiBuilding");
// 		const section = list.AlKhaldiBuilding;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

// 		section.logo = `${res.locals.baseUrl}/uploads/cms/company/${section.logo}`;

// 		section.supportImage = `${res.locals.baseUrl}/uploads/cms/company/${section.supportImage}`;

// 		section.detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.detailsPdf}`;

// 		section.brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.brochuresPdf}`;

// 		for (const imageLabel of section.imageWithLabel) {
// 			imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 		}

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

// exports.getAutoGulf = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("AutoGulf");
// 		const section = list.AutoGulf;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

// 		section.logo = `${res.locals.baseUrl}/uploads/cms/company/${section.logo}`;

// 		section.supportImage = `${res.locals.baseUrl}/uploads/cms/company/${section.supportImage}`;

// 		section.detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.detailsPdf}`;

// 		section.brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.brochuresPdf}`;

// 		for (const imageLabel of section.imageWithLabel) {
// 			imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 		}

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

// exports.getSaudiDrill = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("SaudiDrill");
// 		const section = list.SaudiDrill;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

// 		section.logo = `${res.locals.baseUrl}/uploads/cms/company/${section.logo}`;

// 		section.supportImage = `${res.locals.baseUrl}/uploads/cms/company/${section.supportImage}`;

// 		section.detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.detailsPdf}`;

// 		section.brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.brochuresPdf}`;

// 		for (const imageLabel of section.imageWithLabel) {
// 			imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 		}

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

// exports.getSaudiaFalcon = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("SaudiaFalcon");
// 		const section = list.SaudiaFalcon;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

// 		section.logo = `${res.locals.baseUrl}/uploads/cms/company/${section.logo}`;

// 		section.supportImage = `${res.locals.baseUrl}/uploads/cms/company/${section.supportImage}`;

// 		section.detailsPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.detailsPdf}`;

// 		section.brochuresPdf = `${res.locals.baseUrl}/uploads/cms/company/${section.brochuresPdf}`;

// 		for (const imageLabel of section.imageWithLabel) {
// 			imageLabel.image = `${res.locals.baseUrl}/uploads/cms/company/${imageLabel.image}`;
// 		}

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

// exports.getCompamiesHeader = async (req, res, next) => {
// 	try {
// 		const list = await CompanyList.findOne().select("header");
// 		const section = list.header;

// 		if (!section) {
// 			return res.status(200).json({
// 				status: "success",
// 				result: [],
// 				success: true,
// 				message: "No Data",
// 			});
// 		}

// 		section.image = `${res.locals.baseUrl}/uploads/cms/company/${section.image}`;

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

const folder = "company";

exports.createCompaniesHeader = async (req, res, next) => {
	try {
		const { label, labelAr, image } = req.body;

		const exisitingCompanyList = await CompanyList.find({});

		if (exisitingCompanyList.length > 0) {
			return res.status(400).json({
				status: "fail",
				result: null,
				success: false,
				message: "Already there is Header",
			});
		}

		const headerImage = await saveAndDeleteImage(null, image, folder);

		const newCompanyList = await CompanyList.create({
			header: {
				label,
				labelAr,
				image: headerImage,
			},
			companies: [],
		});

		return res.status(201).json({
			status: "success",
			result: newCompanyList,
			success: true,
			message: "Company Created Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updatedCompaniesHeader = async (req, res, next) => {
	try {
		const { label, labelAr, image } = req.body;

		const companyList = await CompanyList.findOne();

		const updatedHeaderImage = await saveAndDeleteImage(
			companyList.header.image,
			image,
			folder
		);

		companyList.header.label = label || companyList.header.label;
		companyList.header.labelAr = labelAr || companyList.header.labelAr;
		companyList.header.image = updatedHeaderImage;

		const result = await companyList.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Header Updated Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getCompaniesHeader = async (req, res, next) => {
	try {
		const companyList = await CompanyList.findOne().select("header");

		if (!companyList) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const formattedHeader = {
			_id: companyList._id,
			label: companyList.header.label,
			labelAr: companyList.header.labelAr,
			image: `${res.locals.baseUrl}/uploads/cms/company/${companyList.header.image}`,
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

exports.createCompany = async (req, res, next) => {
	try {
		const {
			name,
			nameAr,
			image,
			bio,
			bioAr,
			website,
			logo,
			supportImage,
			detailsPdf,
			brochuresPdf,
			imageWithLabel,
		} = req.body;

		const companyImage = await saveAndDeleteImage(null, image, folder);
		const companyLogo = await saveAndDeleteImage(null, logo, folder);
		const companySupportImage = await saveAndDeleteImage(
			null,
			supportImage,
			folder
		);
		const companyDetailsPdf = await saveAndDeletePdf(null, detailsPdf, folder);
		const companyBrochuresPdf = await saveAndDeletePdf(
			null,
			brochuresPdf,
			folder
		);

		const newImageWithLabel = [];
		for (let i = 0; i < imageWithLabel.length; i++) {
			newImageWithLabel.push({
				label: imageWithLabel[i].label,
				labelAr: imageWithLabel[i].labelAr,
				image: await saveAndDeleteImage(null, imageWithLabel[i].image, folder),
			});
		}

		const newCompany = await Company.create({
			name,
			nameAr,
			bio,
			bioAr,
			website,
			image: companyImage,
			logo: companyLogo,
			supportImage: companySupportImage,
			detailsPdf: companyDetailsPdf,
			brochuresPdf: companyBrochuresPdf,
			imageWithLabel: newImageWithLabel,
		});

		await CompanyList.findOneAndUpdate(
			{},
			{ $push: { companies: newCompany._id } },
			{ new: true, useFindAndModify: false }
		);

		return res.status(201).json({
			status: "success",
			result: newCompany,
			success: true,
			message: "Company Created Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateCompany = async (req, res, next) => {
	try {
		const { companyId } = req.params;
		const {
			name,
			nameAr,
			image,
			bio,
			bioAr,
			website,
			logo,
			supportImage,
			detailsPdf,
			brochuresPdf,
			imageWithLabel,
		} = req.body;

		const existingCompany = await Company.findById(companyId);

		const updatedImage = await saveAndDeleteImage(
			existingCompany.image,
			image,
			folder
		);

		const updatedLogo = await saveAndDeleteImage(
			existingCompany.logo,
			logo,
			folder
		);

		const updatedSupportImage = await saveAndDeleteImage(
			existingCompany.supportImage,
			supportImage,
			folder
		);

		const updatedDetailsPdf = await saveAndDeletePdf(
			existingCompany.detailsPdf,
			detailsPdf,
			folder
		);

		const updatedBrochuresPdf = await saveAndDeletePdf(
			existingCompany.brochuresPdf,
			brochuresPdf,
			folder
		);

		const updatedImagesWithLabel = [];

		for (let i = 0; i < imageWithLabel.length; i++) {
			updatedImagesWithLabel.push({
				label:
					imageWithLabel[i].label || existingCompany.imageWithLabel[i].label,
				labelAr:
					imageWithLabel[i].labelAr ||
					existingCompany.imageWithLabel[i].labelAr,
				image: await saveAndDeleteImage(
					existingCompany.imageWithLabel[i]
						? existingCompany.imageWithLabel[i].image
						: null,
					imageWithLabel[i].image,
					folder
				),
			});
		}

		existingCompany.name = name || existingCompany.name;
		existingCompany.nameAr = nameAr || existingCompany.nameAr;
		existingCompany.bio = bio || existingCompany.bio;
		existingCompany.bioAr = bioAr || existingCompany.bioAr;
		existingCompany.website = website || existingCompany.website;
		existingCompany.image = updatedImage;
		existingCompany.logo = updatedLogo;
		existingCompany.supportImage = updatedSupportImage;
		existingCompany.detailsPdf = updatedDetailsPdf;
		existingCompany.brochuresPdf = updatedBrochuresPdf;
		existingCompany.imageWithLabel = updatedImagesWithLabel;

		const result = await existingCompany.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Company Updated Successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getCompanies = async (req, res, next) => {
	try {
		const companies = await Company.find({}).select("name createdAt");

		if (companies.length === 0) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		// const formattedCompanies = companies.map((company) => {
		// const formattedImageWithLabel = company.imageWithLabel.map(
		// 	(imgWithLabel) => {
		// 		return {
		// 			label: imgWithLabel.label,
		// 			labelAr: imgWithLabel.labelAr,
		// 			image: `${res.locals.baseUrl}/uploads/cms/company/${imgWithLabel.image}`,
		// 		};
		// 	}
		// );

		// return {
		// 	_id: company._id,
		// 	name: company.name,
		// nameAr: company.nameAr,
		// bio: company.bio,
		// bioAr: company.bioAr,
		// website: company.website,
		// image: `${res.locals.baseUrl}/uploads/cms/company/${company.image}`,
		// logo: `${res.locals.baseUrl}/uploads/cms/company/${company.logo}`,
		// supportImage: `${res.locals.baseUrl}/uploads/cms/company/${company.supportImage}`,
		// detailsPdf: `${res.locals.baseUrl}/uploads/cms/company/${company.detailsPdf}`,
		// brochuresPdf: `${res.locals.baseUrl}/uploads/cms/company/${company.brochuresPdf}`,
		// imageWithLabel: formattedImageWithLabel,
		// 	};
		// });

		return res.status(200).json({
			status: "success",
			result: companies,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getCompany = async (req, res, next) => {
	try {
		const { companyId } = req.params;
		const company = await Company.findById(companyId);

		if (!company) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const formattedImageWithLabel = company.imageWithLabel.map(
			(imgWithLabel) => {
				return {
					label: imgWithLabel.label,
					labelAr: imgWithLabel.labelAr,
					image: `${res.locals.baseUrl}/uploads/cms/company/${imgWithLabel.image}`,
				};
			}
		);

		const formattedCompany = {
			_id: company._id,
			name: company.name,
			nameAr: company.nameAr,
			bio: company.bio,
			bioAr: company.bioAr,
			website: company.website,
			image: `${res.locals.baseUrl}/uploads/cms/company/${company.image}`,
			logo: `${res.locals.baseUrl}/uploads/cms/company/${company.logo}`,
			supportImage: `${res.locals.baseUrl}/uploads/cms/company/${company.supportImage}`,
			detailsPdf: `${res.locals.baseUrl}/uploads/cms/company/${company.detailsPdf}`,
			brochuresPdf: `${res.locals.baseUrl}/uploads/cms/company/${company.brochuresPdf}`,
			imageWithLabel: formattedImageWithLabel,
		};

		return res.status(200).json({
			status: "success",
			result: formattedCompany,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteCompany = async (req, res, next) => {
	try {
		const { companyId } = req.params;
		const deletedCompany = await Company.findById(companyId);

		if (!deletedCompany) {
			return res.status(404).json({
				status: "fail",
				message: "Company not found",
			});
		}

		await deleteImage(deletedCompany.image, folder);
		await deleteImage(deletedCompany.logo, folder);
		await deleteImage(deletedCompany.supportImage, folder);
		await deleteImage(deletedCompany.detailsPdf, folder);
		await deleteImage(deletedCompany.brochuresPdf, folder);

		for (const imgWithLabel of deletedCompany.imageWithLabel) {
			await deleteImage(imgWithLabel.image, folder);
		}

		await Company.findByIdAndDelete(companyId);

		await CompanyList.findOneAndUpdate(
			{},
			{ $pull: { companies: companyId } },
			{ new: true, useFindAndModify: false }
		);

		return res.status(200).json({
			status: "success",
			result: [],
			success: true,
			message: "Company Deleted Successfully",
		});
	} catch (error) {
		next(new ApiError("something went wrong " + error, 500));
	}
};

exports.getCompaniesDDL = async (req, res, next) => {
	try {
		const companies = await Company.find({}).select("name");

		if (companies.length === 0) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		return res.status(200).json({
			status: "success",
			result: companies,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getLandingCompanies = async (req, res, next) => {
	try {
		const company = await CompanyList.findOne()
			.select("-_id")
			.populate({
				path: "companies",
				select: req.lang === "ar" ? "nameAr" : "name",
			});

		if (!company) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const response = {
			header: {
				image: `${res.locals.baseUrl}/uploads/cms/company/${company.header.image}`,
				label:
					req.lang === "ar" ? company.header.labelAr : company.header.label,
			},

			companies: company.companies.map((company) => ({
				_id: company._id,
				name: req.lang === "ar" ? company.nameAr : company.name,
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

exports.getLandingCompany = async (req, res, next) => {
	try {
		const { companyId } = req.params;
		const company = await Company.findById(companyId);

		if (!company) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const formattedImageWithLabel = company.imageWithLabel.map(
			(imgWithLabel) => {
				return {
					label: req.lang === "ar" ? imgWithLabel.labelAr : imgWithLabel.label,
					image: `${res.locals.baseUrl}/uploads/cms/company/${imgWithLabel.image}`,
				};
			}
		);

		const formattedCompany = {
			_id: company._id,
			name: req.lang === "ar" ? company.nameAr : company.name,
			bio: req.lang === "ar" ? company.bioAr : company.bio,
			website: company.website,
			image: `${res.locals.baseUrl}/uploads/cms/company/${company.image}`,
			logo: `${res.locals.baseUrl}/uploads/cms/company/${company.logo}`,
			supportImage: `${res.locals.baseUrl}/uploads/cms/company/${company.supportImage}`,
			detailsPdf: `${res.locals.baseUrl}/uploads/cms/company/${company.detailsPdf}`,
			brochuresPdf: `${res.locals.baseUrl}/uploads/cms/company/${company.brochuresPdf}`,
			imageWithLabel: formattedImageWithLabel,
		};

		return res.status(200).json({
			status: "success",
			result: formattedCompany,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

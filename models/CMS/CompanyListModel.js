const mongoose = require("mongoose");

const imageWithLabelSchema = new mongoose.Schema(
	{ image: String, label: String, labelAr: String },
	{ _id: false }
);

const CompanySchema = new mongoose.Schema(
	{
		key: String,
		name: String,
		nameAr: String,
		image: String,
		bio: String,
		bioAr: String,
		website: String,
		logo: String,
		supportImage: String,
		brochuresPdf: String,
		detailsPdf: String,
		imageWithLabel: [imageWithLabelSchema],
	},
	{ timestamps: true }
);

const CompanyListSchema = new mongoose.Schema({
	header: {
		image: {
			type: String,
			default: null,
		},
		label: {
			type: String,
			default: null,
		},
		labelAr: {
			type: String,
			default: null,
		},
	},

	companies: [{ type: mongoose.Schema.ObjectId, ref: "Company" }],

	// AlKhaldiLogistics: CompanySchema,
	// FuelWay: CompanySchema,
	// AlkhaldiRealState: CompanySchema,
	// AlKhaldiBuilding: CompanySchema,
	// AutoGulf: CompanySchema,
	// SaudiDrill: CompanySchema,
	// SaudiaFalcon: CompanySchema,
});

const Company = mongoose.model("Company", CompanySchema);
const CompanyList = mongoose.model("CompanyList", CompanyListSchema);

module.exports = {
	Company,
	CompanyList,
};

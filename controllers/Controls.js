const Controls = require("../models/Controls");
const ApiError = require("../util/ApiError");

exports.createControls = async (req, res, next) => {
	try {
		const { phone, email, location } = req.body;

		const existingControls = await Controls.find({});

		if (existingControls.length > 0) {
			return res.status(400).json({
				status: "fail",
				result: null,
				success: false,
				message: "Already there is controls",
			});
		}

		const newControls = await Controls.create({ phone, email, location });

		return res.status(201).json({
			status: "success",
			result: newControls,
			success: true,
			message: "controls created successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updatedControls = async (req, res, next) => {
	try {
		const { phone, email, location } = req.body;

		const existingControls = await Controls.findOne();

		if (!existingControls) {
			return res.status(404).json({
				status: "success",
				result: [],
				success: true,
				message: "Not Found",
			});
		}

		existingControls.phone = phone || existingControls.phone;
		existingControls.email = email || existingControls.email;
		existingControls.location = location || existingControls.location;

		const result = await existingControls.save();

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "controls updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getControls = async (req, res, next) => {
	try {
		const controls = await Controls.findOne();

		if (!controls) {
			return res.status(404).json({
				status: "success",
				result: [],
				success: true,
				message: "Not Found",
			});
		}

		return res.status(200).json({
			status: "success",
			result: controls,
			success: true,
			message: "controls updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

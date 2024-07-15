const User = require("../models/userModel");
const Blog = require("../models/blogModel");
const Contact = require("../models/contectModel");
const { Carrer } = require("../models/carrerModel");
const ApiError = require("../util/ApiError");

exports.getCardsData = async (req, res, next) => {
	try {
		const totalUsers = await User.countDocuments();
		const totalBlogs = await Blog.countDocuments();
		const contactEnteries = await Contact.countDocuments();
		const carrerEnteries = await Carrer.countDocuments();

		return res.status(200).json({
			status: "success",
			result: {
				totalUsers,
				totalBlogs,
				contactEnteries,
				carrerEnteries,
			},
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

const monthNameToNumber = {
	January: 1,
	February: 2,
	March: 3,
	April: 4,
	May: 5,
	June: 6,
	July: 7,
	August: 8,
	September: 9,
	October: 10,
	November: 11,
	December: 12,
};

exports.getChartData = async (req, res, next) => {
	try {
		const months = Object.keys(monthNameToNumber);
		const counts = await Promise.all(
			months.map(async (month) => {
				const count = await Blog.countDocuments({
					isPublished: true,
					$expr: { $eq: [{ $month: "$createdAt" }, monthNameToNumber[month]] },
				});
				return count;
			})
		);

		return res.status(200).json({
			status: "success",
			result: counts,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("something went wrong " + error, 500));
	}
};

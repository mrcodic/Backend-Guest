const fs = require("fs");
const path = require("path");
const { Carrer, CarrerContent } = require("../models/carrerModel");
const ApiError = require("../util/ApiError");
const { processImage } = require("../util/proccessImage");
const { default: mongoose } = require("mongoose");
const { Emails } = require("../models/Settings");
const createTransporter = require("../util/createTransporter");

// @desc create
// @route POST /api/v1/carrer
// @access Public
exports.createCarrer = async (req, res, next) => {
	try {
		const jobCarrer = await Carrer.create(req.body);

		const emails = await Emails.findOne();

		const transport = await createTransporter();

		const mailOptions = {
			from: emails.senderEmail.fromEmail,
			to: emails.receiverEmails,
			subject: "New Career Form Entry",
			html: `
<body
	style="
		font-family: Arial, sans-serif;
		background-color: #f4f4f4;
		margin: 0;
		padding: 0;
	"
>
	<div
		style="
			max-width: 600px;
			margin: 50px auto;
			background: #fff;
			padding: 20px;
			border: 1px solid #ddd;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		"
	>
		<div style="padding: 20px; margin: 10px; border: 10px solid #006566">
			<header>
				<h1 style="text-align: center; font-size: 24px; color: #333">
					New Career Form Entry
				</h1>
			</header>
			<section style="padding: 20px; text-align: center">
				<div style="max-width: 100px; margin: 0 auto 20px">
					<img
						src="http://127.0.0.1:8000/logo.svg"
						alt="Logo"
						style="width: 100%"
					/>
				</div>
				<div style="text-align: left">
					<p style="font-size: 16px; color: #555; margin: 10px 0">Hello!</p>

					<p style="font-size: 16px; color: #555; margin: 10px 0">
						A new career form has been submitted with the following details:
					</p>

					<ul
						style="
							font-size: 16px;
							color: #555;
							list-style-type: none;
							padding: 0;
						"
					>
						<li style="margin: 10px 0"><strong>First Name:</strong> ${jobCarrer.firstName}</li>
						<li style="margin: 10px 0"><strong>Last Name:</strong> ${jobCarrer.lastName}</li>
						<li style="margin: 10px 0">
							<strong>Email:</strong> ${jobCarrer.email}
						</li>
						<li style="margin: 10px 0">
							<strong>Phone Number:</strong> ${jobCarrer.phoneNumber}
						</li>
						<li style="margin: 10px 0">
							<strong>Message:</strong> ${jobCarrer.message}
						</li>
						<li style="margin: 10px 0">
							<strong>CV:</strong>
							<a
								href="http://127.0.0.1:8000/uploads/CVs/${jobCarrer.cvFile}"
								download="${jobCarrer.cvFile}"
								>Download CV</a
							>
						</li>
					</ul>

					<div style="text-align: center; margin-top: 20px">
						<a
							href="https://al-khaldi.com.sa/authentication/adminpanel/careers"
							style="
								background-color: #006566;
								color: #fff;
								padding: 10px 20px;
								text-decoration: none;
								border-radius: 4px;
								display: inline-block;
							"
							>View All Career Entries</a
						>
					</div>
				</div>
			</section>
		</div>
	</div>
</body>
`,
		};

		await transport.sendMail(mailOptions);

		return res.status(201).json({
			status: "success",
			result: jobCarrer,
			success: true,
			message: "new career created successfully",
		});
	} catch (error) {
		next(new ApiError("something went wrong " + error, 500));
	}
};

// @desc get carrers
// @route GET /api/v1/admin/carrer
// @access Private
exports.getCarrers = async (req, res, next) => {
	try {
		const { limit, skip } = req.pagination;
		const carrers = await Carrer.find({})
			.sort({ createdAt: -1 })
			.limit(limit)
			.skip(skip);

		await Promise.all(
			carrers.map(async (carrer) => {
				carrer.cvFile = await processImage(res, carrer, "CVs");
			})
		);

		return res.status(200).json({
			status: "success",
			result: carrers,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get carrer
// @route GET /api/v1/admin/carrer/:carrerId
// @access Private
exports.getCarrer = async (req, res, next) => {
	try {
		const { carrerId } = req.params;
		const carrer = await Carrer.findById(carrerId);

		if (!carrer) {
			return next(new ApiError("carrer not found by this id " + carrerId, 404));
		}
		carrer.cvFile = await processImage(res, carrer, "CVs");

		return res.status(200).json({
			status: "success",
			result: carrer,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc delete carrer
// @route DELETE /api/v1/admin/carrer/:carrerId
// @access Private
exports.deleteCarrer = async (req, res, next) => {
	try {
		const { carrerId } = req.params;

		const carrer = await Carrer.findById(carrerId);

		if (!carrer) {
			return next(new ApiError("carrer not found", 400));
		}

		if (carrer.cvFile) {
			const cvPath = path.join("uploads", "CVs", carrer.cvFile);

			fs.unlink(cvPath, (err) => {
				if (err) {
					throw new Error("Error deleting the file");
				}
			});
		}

		await Carrer.findByIdAndDelete(carrerId);

		return res.status(200).json({
			status: "success",
			result: {},
			success: true,
			message: "Job post deleted",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error.message, 500));
	}
};

// @desc delete many carrers
// @route DELETE /api/v1/admin/carrer
// @access Private
exports.deleteManyCarrers = async (req, res, next) => {
	try {
		const { carrerIds } = req.body;

		if (!carrerIds || carrerIds.length === 0) {
			return res.status(400).json({
				status: "fail",
				message: "Carrer IDs array is required and must not be empty.",
			});
		}

		const carrerIdObjects = carrerIds.map(
			(carrerId) => new mongoose.Types.ObjectId(carrerId)
		);

		const carrers = await Carrer.find({ _id: carrerIdObjects });

		for (const carrer of carrers)
			if (carrer.cvFile) {
				const cvPath = path.join("uploads", "CVs", carrer.cvFile);

				fs.unlink(cvPath, (err) => {
					if (err) {
						throw new Error("Error deleting the file");
					}
				});
			}

		await Carrer.deleteMany({
			_id: { $in: carrerIdObjects },
		});

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "carrers deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.updateCarrerContent = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { title, paragraph, titleAr, paragraphAr } = req.body;

		let section;

		if (id) {
			section = await CarrerContent.findById(id);
		} else {
			section = new CarrerContent();
		}

		const result = await CarrerContent.findOneAndUpdate(
			{ _id: section._id },
			{
				title,
				titleAr,
				paragraph,
				paragraphAr,
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
			message: "Content updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getCarrerContent = async (req, res, next) => {
	try {
		const carrersContent = await CarrerContent.findOne();

		if (!carrersContent) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		return res.status(200).json({
			status: "success",
			result: carrersContent,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.getCarrerContentLanding = async (req, res, next) => {
	try {
		const carrersContent = await CarrerContent.findOne();

		if (!carrersContent) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		const title =
			req.lang === "ar" ? carrersContent.titleAr : carrersContent.title;

		const paragraph =
			req.lang === "ar" ? carrersContent.paragraphAr : carrersContent.paragraph;

		return res.status(200).json({
			status: "success",
			result: {
				_id: carrersContent._id,
				title,
				paragraph,
			},
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

const { Setting, Emails } = require("../models/Settings");
const ApiError = require("../util/ApiError");

// exports.createSocailMedia = async (req, res, next) => {
// 	try {
// 		const {
// 			facebook,
// 			twitter,
// 			behance,
// 			dripple,
// 			linkedin,
// 			instagram,
// 			location,
// 		} = req.body;

// 		const existingSocialMedia = await Setting.find({
// 			socialMedia: { $ne: null },
// 		});

// 		if (existingSocialMedia.length > 0) {
// 			return res.status(400).json({
// 				status: "fail",
// 				result: null,
// 				success: false,
// 				message: "Already there is socail Media",
// 			});
// 		}

// 		const result = await Setting.create({
// 			socialMedia: { facebook, twitter, behance, dripple, linkedin, instagram },
// 			location,
// 		});

// 		return res.status(201).json({
// 			status: "success",
// 			result: result,
// 			success: true,
// 			message: "Socail Media created successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

exports.updateSocialMedia = async (req, res, next) => {
	try {
		const { id } = req.params;

		const {
			facebook,
			twitter,
			behance,
			dripple,
			linkedin,
			instagram,
			location,
		} = req.body;

		let section;

		if (id) {
			section = await Setting.findById(id);
		} else {
			section = new Setting();
		}

		const result = await Setting.findOneAndUpdate(
			{ _id: section._id },
			{
				$set: {
					socialMedia: {
						facebook,
						twitter,
						behance,
						dripple,
						linkedin,
						instagram,
					},
					location,
				},
			},
			{
				new: true,
				upsert: true,
			}
		);

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Socail Media updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// exports.createEmails = async (req, res, next) => {
// 	try {
// 		const {
// 			smtpUsername,
// 			smtpPassword,
// 			smtpAccountName,
// 			smtpServer,
// 			port,
// 			securityProtocol,
// 			fromEmail,
// 			fromName,
// 			disableCertificateVerification,
// 			receiverEmails,
// 		} = req.body;

// 		const existingSetting = await Emails.findOne({
// 			senderEmail: { $ne: null },
// 		});

// 		if (existingSetting) {
// 			return res.status(400).json({
// 				status: "fail",
// 				result: null,
// 				success: false,
// 				message: "Already there is Sender Email",
// 			});
// 		}

// 		const result = await Emails.create({
// 			senderEmail: {
// 				smtpUsername,
// 				smtpPassword,
// 				smtpAccountName,
// 				smtpServer,
// 				port,
// 				securityProtocol,
// 				fromEmail,
// 				fromName,
// 				disableCertificateVerification,
// 			},
// 			receiverEmails,
// 		});

// 		return res.status(201).json({
// 			status: "success",
// 			result: result,
// 			success: true,
// 			message: "Emails created successfully",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

exports.updateSenderEmail = async (req, res, next) => {
	try {
		const {
			smtpUsername,
			smtpPassword,
			smtpServer,
			port,
			securityProtocol,
			fromEmail,
			fromName,
			disableCertificateVerification,
		} = req.body;

		const existingSetting = await Emails.findOne();

		let result;

		if (existingSetting) {
			existingSetting.senderEmail.smtpUsername =
				smtpUsername || existingSetting.senderEmail.smtpUsername;

			existingSetting.senderEmail.smtpPassword =
				smtpPassword || existingSetting.senderEmail.smtpPassword;

			existingSetting.senderEmail.smtpServer =
				smtpServer || existingSetting.senderEmail.smtpServer;

			existingSetting.senderEmail.port =
				port || existingSetting.senderEmail.port;

			existingSetting.senderEmail.securityProtocol =
				securityProtocol || existingSetting.senderEmail.securityProtocol;

			existingSetting.senderEmail.fromEmail =
				fromEmail || existingSetting.senderEmail.fromEmail;

			existingSetting.senderEmail.fromName =
				fromName || existingSetting.senderEmail.fromName;

			existingSetting.senderEmail.disableCertificateVerification =
				disableCertificateVerification ||
				existingSetting.senderEmail.disableCertificateVerification;

			result = await existingSetting.save();
		} else {
			result = await Emails.create({
				senderEmail: {
					smtpUsername,
					smtpPassword,
					smtpServer,
					port,
					securityProtocol,
					fromEmail,
					fromName,
					disableCertificateVerification,
				},
			});
		}

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Sender email updated successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.addReceiverEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		const existingEmail = await Emails.findOne({ receiverEmails: email });

		if (existingEmail) {
			return res.status(400).json({
				status: "fail",
				result: null,
				success: false,
				message: "this email already exisit",
			});
		}

		const section = await Emails.findOne();
		section.receiverEmails.push(email);
		await section.save();

		return res.status(201).json({
			status: "success",
			result: section,
			success: true,
			message: "Email added successfully",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

exports.deleteReceiverEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		const existingEmail = await Emails.findOne({
			receiverEmails: { $ne: email },
		});

		if (existingEmail) {
			return res.status(400).json({
				status: "fail",
				result: null,
				success: false,
				message: "This email does not exist",
			});
		}

		const result = await Emails.findOneAndUpdate(
			{ receiverEmails: email },
			{ $pull: { receiverEmails: email } },
			{ new: true }
		);

		return res.status(200).json({
			status: "success",
			result: result,
			success: true,
			message: "Email removed successfully",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

exports.getSocialMedia = async (req, res, next) => {
	try {
		const social = await Setting.findOne();

		if (!social) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		return res.status(200).json({
			status: "success",
			result: social,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

exports.getEmails = async (req, res, next) => {
	try {
		const emails = await Emails.findOne();

		if (!emails) {
			return res.status(200).json({
				status: "success",
				result: [],
				success: true,
				message: "No Data",
			});
		}

		return res.status(200).json({
			status: "success",
			result: emails,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

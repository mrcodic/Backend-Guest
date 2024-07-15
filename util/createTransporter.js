const nodemailer = require("nodemailer");
const { Emails } = require("../models/Settings");

const createTransporter = async () => {
	const emailConfig = await Emails.findOne();
	if (!emailConfig) {
		throw new Error("Email configuration not found");
	}

	const {
		smtpServer,
		port = 587,
		securityProtocol,
		smtpUsername,
		smtpPassword,
		disableCertificateVerification = false,
	} = emailConfig.senderEmail;

	const isSecure = securityProtocol === "SSL" || securityProtocol === "TLS";

	const transporter = nodemailer.createTransport({
		host: smtpServer,
		port: port,
		secure: port === 465 ? isSecure : !isSecure,
		auth: {
			user: smtpUsername,
			pass: smtpPassword,
		},
		tls: {
			rejectUnauthorized: disableCertificateVerification,
		},
	});

	return transporter;
};

module.exports = createTransporter;

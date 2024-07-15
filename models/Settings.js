const mongoose = require("mongoose");

const SettingSchema = new mongoose.Schema({
	socialMedia: {
		facebook: { type: String, default: null },
		twitter: { type: String, default: null },
		behance: { type: String, default: null },
		dripple: { type: String, default: null },
		linkedin: { type: String, default: null },
		instagram: { type: String, default: null },
	},

	location: { type: String, default: null },
});

const EmailsSchema = new mongoose.Schema({
	senderEmail: {
		// smtpAccountName: String,
		fromEmail: String,
		fromName: String,
		smtpServer: String,
		port: Number,
		securityProtocol: {
			type: String,
			enum: ["SSL", "TLS"],
		},
		smtpUsername: String,
		smtpPassword: String,
		disableCertificateVerification: Boolean,
	},

	receiverEmails: { type: [String], default: [] },
});

const Setting = mongoose.model("Setting", SettingSchema);

const Emails = mongoose.model("Emails", EmailsSchema);

module.exports = { Setting, Emails };

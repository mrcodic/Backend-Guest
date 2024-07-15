const mongoose = require("mongoose");
const Contact = require("../models/contectModel");
const ApiError = require("../util/ApiError");
const { Emails } = require("../models/Settings");
const createTransporter = require("../util/createTransporter");

// @desc create contact
// @route POST /api/v1/contact
// @access Public
exports.createContact = async (req, res, next) => {
	try {
		const contact = await Contact.create(req.body);

		const emails = await Emails.findOne();

		const transport = await createTransporter();

		const mailOptions = {
			from: emails.senderEmail.fromEmail,
			to: emails.receiverEmails,
			subject: "New Contact Form Entry",
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
					New Contact Form Entry
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
						A new contact form has been submitted with the following details:
					</p>

					<ul
						style="
							font-size: 16px;
							color: #555;
							list-style-type: none;
							padding: 0;
						"
					>
						<li style="margin: 10px 0">
							<strong>Full Name:</strong> ${contact.fullName}
						</li>
						<li style="margin: 10px 0">
							<strong>Email:</strong> ${contact.email}
						</li>
						<li style="margin: 10px 0">
							<strong>Subject:</strong> ${contact.subject}
						</li>
						<li style="margin: 10px 0">
							<strong>Message:</strong> ${contact.message}
						</li>
					</ul>

					<div style="text-align: center; margin-top: 20px">
						<a
							href="https://al-khaldi.com.sa/authentication/adminpanel/contact-us"
							style="
								background-color: #006566;
								color: #fff;
								padding: 10px 20px;
								text-decoration: none;
								border-radius: 4px;
								display: inline-block;
							"
							>View All Contact Entries</a
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
			result: contact,
			success: true,
			message: "New contact created successfully",
		});
	} catch (error) {
		next(new ApiError("Something went wrong " + error, 500));
	}
};

// @desc get all contacts
// @route GET /api/v1/admin/contact
// @access Private
exports.getContacts = async (req, res, next) => {
	try {
		const contacts = await Contact.find({}).sort({ createdAt: -1 });

		return res.status(200).json({
			status: "success",
			result: contacts,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc get one contact
// @route GET /api/v1/admin/contact/:contactId
// @access Private
exports.getContact = async (req, res, next) => {
	try {
		const { contactId } = req.params;

		if (!contactId) {
			return res.status(400).json({
				status: "fail",
				message: "contact ID is required",
			});
		}

		const contact = await Contact.findById(contactId);

		return res.status(200).json({
			status: "success",
			result: contact,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc delete one contact
// @route DELETE /api/v1/admin/contact/:contactId
// @access Private
exports.deleteContact = async (req, res, next) => {
	try {
		const { contactId } = req.params;

		if (!contactId) {
			return res.status(400).json({
				status: "fail",
				message: "contact ID is required",
			});
		}

		await Contact.findByIdAndDelete(contactId);

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

// @desc delete many contacts
// @route DELETE /api/v1/admin/contact
// @access Private
exports.deleteManyContacts = async (req, res, next) => {
	try {
		const { contactIds } = req.body;

		if (!contactIds || contactIds.length === 0) {
			return res.status(400).json({
				status: "fail",
				message: "Contact IDs array is required and must not be empty.",
			});
		}

		const contactIdObjects = contactIds.map(
			(contactId) => new mongoose.Types.ObjectId(contactId)
		);

		await Contact.deleteMany({
			_id: { $in: contactIdObjects },
		});

		return res.status(200).json({
			status: "success",
			result: null,
			success: true,
			message: "contacts deleted",
		});
	} catch (error) {
		next(new ApiError("somthing went wrong " + error, 500));
	}
};

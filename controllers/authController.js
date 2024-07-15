const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ApiError = require("../util/ApiError");
const { ADMIN } = require("../constants/userRoles");
const { host } = require("../constants/host");

const buildToken = (user) => {
	const expiresIn = 86400;
	const expirationDate = Math.floor(Date.now() / 1000) + expiresIn;

	const token = jwt.sign(
		{
			user: {
				_id: user._id,
				role: user.role,
				userName: user.userName,
			},
		},
		process.env.JWT_SECRET_KEY,
		{ expiresIn }
	);
	return { token, expiresIn, expirationDate };
};

const loginUser = async (model, email, password) => {
	const user = await model.findOne({ email: email.toLowerCase() });
	if (user) {
		const isPasswordCorrect = await bcryptjs.compare(password, user.password);
		if (isPasswordCorrect) {
			return user;
		}
	}
	return null;
};

const extractUserInfo = (res, user) => {
	return {
		_id: user?._id,
		userName: user?.firstName,
		email: user?.email,
		role: user?.role,
		createdAt: user?.createdAt,
		updatedAt: user?.updatedAt,
		image: `${res.locals.baseUrl}/uploads/user/${user?.image}`,
	};
};

// @desc login to Alkhaldi
// @route POST /api/v1/auth/login
// @access Public
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const admin = await loginUser(User, email, password);
		if (admin) {
			const token = buildToken(admin).token;
			return res.status(200).json({
				status: "success",
				result: {
					user: extractUserInfo(res, admin),
					token,
				},
				message: "Logged in successfully",
			});
		}

		const author = await loginUser(User, email, password);
		if (author) {
			const token = buildToken(author).token;
			return res.status(200).json({
				status: "success",
				result: {
					user: extractUserInfo(res, author),
					token,
				},
				message: "Logged in successfully",
			});
		}

		return next(new ApiError("User Not Found or password is incorrect", 404));
	} catch (error) {
		next(new ApiError("Something went wrong " + error, 500));
	}
};

exports.signiup = async (req, res, next) => {
	try {
		const { firstName, lastName, userName, email, password } = req.body;

		const hashedPassword = await bcryptjs.hash(password, 12);

		const newAdmin = await User.create({
			firstName,
			lastName,
			userName,
			email,
			password: hashedPassword,
			role: ADMIN,
		});

		res.status(201).json({
			status: "success",
			result: newAdmin,
			message: "admin created successfully",
		});
	} catch (error) {
		next(error);
	}
};

exports.tokenBlackList = new Set();

// @desc logout from Alkhaldi
// @route POST /api/v1/auth/logout
// @access Private
exports.logout = async (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	this.tokenBlackList.add(token);
	res.status(200).json({ status: "success", message: "success" });
};

const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");

dotenv.config({ path: "config.env" });

const dbConnection = require("./config/database");
const ApiError = require("./util/ApiError.js");
const globalError = require("./middlewares/errorMiddleware");
const isAuth = require("./middlewares/isAuth");
const isRole = require("./middlewares/isRole");

const { ADMIN, AUTHOR } = require("./constants/userRoles.js");

const authRoutes = require("./routes/authRouter");
const adminRoutes = require("./routes/adminRouter");
const authorRoutes = require("./routes/authorRouter");
const carrerRoutes = require("./routes/carrerRouter.js");
const contactRoutes = require("./routes/contactRouter.js");
const landingRoutes = require("./routes/landingRouter.js");

dbConnection();

const app = express();

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use(
	cors({
		origin: "*",
		methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
		allowedHeaders: "Content-Type,Authorization",
		preflightContinue: false,
		optionsSuccessStatus: 204,
	})
);

app.options("*", (req, res) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Auth-Token, Access-Control-Allow-Headers"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	res.sendStatus(200);
});

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept , Authorization ,X-Auth-Token ,Access-Control-Allow-Headers"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	next();
});

console.log(`mode: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === "development") {
	app.use(
		morgan("dev", {
			skip: (req) => req.method === "OPTIONS",
		})
	);
}

if (process.env.NODE_ENV === "development") {
	app.use((req, res, next) => {
		const protocol = "http";
		const hostname = "localhost:8000";
		res.locals.baseUrl = `${protocol}://${hostname}`;
		next();
	});
} else {
	app.use((req, res, next) => {
		const protocol = req.headers["x-forwarded-proto"] || req.protocol;
		const hostname = req.headers.host.split(":")[0];
		res.locals.baseUrl = `${protocol}://${hostname}`;
		next();
	});
}

app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/landing", landingRoutes);
app.use("/api/v1/carrer", carrerRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", isAuth, isRole([{ value: ADMIN }]), adminRoutes);
app.use("/api/v1/author", isAuth, isRole([{ value: AUTHOR }]), authorRoutes);

app.use("*", (req, res, next) => {
	next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

app.use(globalError);

module.exports = app;

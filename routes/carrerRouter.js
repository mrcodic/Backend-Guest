const express = require("express");

const router = express.Router();

const {
	createCarrer,
	getCarrerContentLanding,
} = require("../controllers/carrerController");
const { uploadCvMiddleware } = require("../middlewares/uploadImageMiddlewar");

const { createCarrerValidator } = require("../util/validators/carrerValidator");

const determineLanguage = require("../middlewares/languageMiddleware");

router.route("/").post(createCarrerValidator, uploadCvMiddleware, createCarrer);
router.get("/content", determineLanguage, getCarrerContentLanding);

module.exports = router;

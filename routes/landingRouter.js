const express = require("express");

const router = express.Router();

const {
	getLandingPage,
	getSocial,
	getBoard,
	getCompanyList,
	getGallery,
	getNews,
	getPost,
	filterPosts,
	getTeamSection,
	getWhoAre,
	getAboutMessage,
} = require("../controllers/CMS");

const {
	getLandingSocials,
	getLandingSocial,
} = require("../controllers/CMS/SocialController");

const {
	getLandingCompanies,
	getLandingCompany,
} = require("../controllers/CMS/CompanyListController");

const { getSocialMedia } = require("../controllers/SettingController");

const determineLanguage = require("../middlewares/languageMiddleware");

router.get("/home", determineLanguage, getLandingPage);

router.get("/settings/social", getSocialMedia);
router.get("/social", determineLanguage, getLandingSocials);
router.get("/social/:memberId", determineLanguage, getLandingSocial);
router.get("/company", determineLanguage, getLandingCompanies);
router.get("/company/:companyId", determineLanguage, getLandingCompany);
router.get("/board", determineLanguage, getBoard);
router.get("/gallery", determineLanguage, getGallery);
router.get("/news", getNews);
router.post("/news/filter", filterPosts);
router.get("/news/:postId", getPost);
router.get("/team", determineLanguage, getTeamSection);
router.get("/whoweare", determineLanguage, getWhoAre);
router.get("/about", determineLanguage, getAboutMessage);

module.exports = router;

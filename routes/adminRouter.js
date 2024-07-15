const express = require("express");

const router = express.Router();

const {
	createUser,
	getUsers,
	getUser,
	updateUser,
	deleteUser,
	deleteMenyUsers,
	getAuthenticatedUser,
	updateUserProfile,
	resetPassword,
} = require("../controllers/userController");

const {
	createPost,
	getPost,
	updatePost,
	deletePost,
	deleteMenyPosts,
	getPublishedPosts,
	getDraftedPosts,
	togglePostStatus,
} = require("../controllers/blogController");

const {
	uploadImage,
	resizeImage,
} = require("../middlewares/uploadImageMiddlewar");
const { pagination } = require("../middlewares/paginationMiddleware");

const { createUserValidator } = require("../util/validators/adminValidator");

const {
	getTags,
	createTag,
	getTag,
	updateTag,
	deleteTag,
	deleteMenyTags,
} = require("../controllers/tagController");

const {
	getCategories,
	createCategory,
	getCategory,
	updateCategory,
	deleteCategory,
	getParentCategoriesDDL,
	deleteMenyCategories,
	getSubCategoriesDDL,
	getSubCategoriesBasedOnParent,
} = require("../controllers/categoryController");

const {
	getCarrers,
	getCarrer,
	deleteCarrer,
	deleteManyCarrers,
	createCarrerContent,
	updateCarrerContent,
	getCarrerContent,
} = require("../controllers/carrerController");

const {
	getContacts,
	getContact,
	deleteContact,
	deleteManyContacts,
} = require("../controllers/contactController");

const {
	updateWhoWeAre,
	updateWhoWeAreTimeLine,
	getWhoWeAreTimeLine,
	getWhoAre,
	updateWhoWeAreTimeLineHeader,
	getWhoWeAreTimeLineHeader,
} = require("../controllers/CMS/whoweareController");

const {
	createGalleryCategory,
	updateGalleryCategory,
	getGalleryCategories,
	getGalleryCategory,
	deleteGalleryCategory,
} = require("../controllers/CMS/GalleryCategory");

const {
	updateBoard,
	getBoard,
	updateBoardMemberOrder,
} = require("../controllers/CMS/BoardController");

const {
	getTeamSection,
	updateTeamSection,
	updateTeamMemberOrder,
} = require("../controllers/CMS/TeamController");

const {
	// getCompanyList,
	// updateCompanyList,
	// updateAlKhaldiLogistics,
	// updateAlKhaldiBuilding,
	// updateAlkhaldiRealState,
	// updateFuelWay,
	// updateAutoGulf,
	// updateSaudiDrill,
	// updateSaudiaFalcon,
	// updateCompaniesHeader,
	// getAlKhaldiLogistics,
	// getAlKhaldiBuilding,
	// getAlkhaldiRealState,
	// getFuelWay,
	// getAutoGulf,
	// getSaudiDrill,
	// getSaudiaFalcon,
	// getCompamiesHeader,
	createCompaniesHeader,
	getCompaniesHeader,
	updatedCompaniesHeader,
	createCompany,
	updateCompany,
	getCompanies,
	getCompany,
	deleteCompany,
	getCompaniesDDL,
} = require("../controllers/CMS/CompanyListController");

const {
	getGallery,
	updateGallery,
} = require("../controllers/CMS/GalleryController");

const { getNews, updateNews } = require("../controllers/CMS/NewsController");

const {
	getSocial,
	updateSocial,
	createSocialHeader,
	getSocialHeader,
	updatedSocialHeader,
	createSocialMember,
	getMembers,
	getMember,
	updateSocialMember,
	deleteMember,
} = require("../controllers/CMS/SocialController");

const {
	getHome,
	updateHome,
	updateHomeHeader,
	getHomeHeader,
	updateStatistics,
	getStatistics,
	updateTimeLine,
	getTimeLine,
	updateIndustry,
	getIndustry,
	updatePartner,
	getPartner,
	updateMessage,
	getMessage,
	deleteHomeHeader,
	deleteHomeStatistics,
	deleteHomeTimeLine,
	deleteHomeIndustry,
	deleteHomePartner,
	updateAboutMessage,
	getAboutMessage,
	updateTimeLineHeader,
	getTimeLineHeader,
	updatePartnerOrder,
} = require("../controllers/CMS/HomeController");
const {
	getCardsData,
	getChartData,
} = require("../controllers/dashboardController");

const {
	createControls,
	getControls,
	updatedControls,
} = require("../controllers/Controls");

const {
	createSocailMedia,
	updateSocialMedia,
	createEmails,
	updateSenderEmail,
	addReceiverEmail,
	deleteReceiverEmail,
	getSocialMedia,
	getEmails,
} = require("../controllers/SettingController");
const determineLanguage = require("../middlewares/languageMiddleware");

router.get("/user/auth", getAuthenticatedUser);
router.patch("/user/profile", updateUserProfile);
router.patch("/user/reset-password", resetPassword);

router
	.route("/user")
	.get(pagination, getUsers)
	.post(createUserValidator, uploadImage, resizeImage, createUser)
	.delete(deleteMenyUsers);

router.route("/user/:userId").get(getUser).patch(updateUser).delete(deleteUser);

router.get("/blog/draft", pagination, getDraftedPosts);
router
	.route("/blog")
	.get(pagination, getPublishedPosts)
	.post(uploadImage, resizeImage, createPost)
	.delete(deleteMenyPosts);
router.patch("/blog/status/:postId", togglePostStatus);
router.route("/blog/:postId").get(getPost).patch(updatePost).delete(deletePost);

router
	.route("/tag")
	.get(pagination, getTags)
	.post(createTag)
	.delete(deleteMenyTags);
router.route("/tag/:tagId").get(getTag).patch(updateTag).delete(deleteTag);

router.post(
	"/category/children-based-on-parent/DDL",
	getSubCategoriesBasedOnParent
);
router.get("/category/sub/DDL", getSubCategoriesDDL);
router.get("/category/DDL", getParentCategoriesDDL);
router
	.route("/category")
	.get(pagination, getCategories)
	.post(createCategory)
	.delete(deleteMenyCategories);
router
	.route("/category/:categoryId")
	.get(getCategory)
	.patch(updateCategory)
	.delete(deleteCategory);

router
	.route("/carrer/content/:id?")
	.patch(updateCarrerContent)
	.get(getCarrerContent);

router.route("/carrer").get(pagination, getCarrers).delete(deleteManyCarrers);
router.route("/carrer/:carrerId").get(getCarrer).delete(deleteCarrer);

router
	.route("/contact")
	.get(pagination, getContacts)
	.delete(deleteManyContacts);

router.route("/contact/:contactId").get(getContact).delete(deleteContact);

// cms
router
	.route("/cms/whoweare/timeline/header/:id?")
	.patch(updateWhoWeAreTimeLineHeader)
	.get(getWhoWeAreTimeLineHeader);

router.patch("/cms/whoweare/timeline/:id?", updateWhoWeAreTimeLine);
router.get("/cms/whoweare/timeline", getWhoWeAreTimeLine);

router.patch("/cms/whoweare/:id?", updateWhoWeAre);
router.get("/cms/whoweare", getWhoAre);

router.patch("/cms/board/:id?", updateBoard);
router.get("/cms/board", getBoard);
// router.patch("/cms/board/rearrange/order", updateBoardMemberOrder);

router.route("/cms/team").get(getTeamSection).patch(updateTeamSection);
// router.patch("/cms/team/rearrange/order", updateTeamMemberOrder);

// router.patch("/cms/team/:id?", updateTeamSection);
// router.get("/cms/team", getTeamSection);

router
	.route("/cms/company/header")
	.post(createCompaniesHeader)
	.get(getCompaniesHeader)
	.patch(updatedCompaniesHeader);

router.get("/cms/company/DDL", getCompaniesDDL);

router
	.route("/cms/company")
	.get(determineLanguage, getCompanies)
	.post(createCompany);
router
	.route("/cms/company/:companyId")
	.patch(updateCompany)
	.get(getCompany)
	.delete(deleteCompany);

// OLD Companies CMS
// router
// 	.route("/cms/company/alKhaldi-logistics")
// 	.get(getAlKhaldiLogistics)
// 	.patch(updateAlKhaldiLogistics);

// router
// 	.route("/cms/company/alKhaldi-building")
// 	.get(getAlKhaldiBuilding)
// 	.patch(updateAlKhaldiBuilding);

// router
// 	.route("/cms/company/alKhaldi-realstate")
// 	.get(getAlkhaldiRealState)
// 	.patch(updateAlkhaldiRealState);

// router.route("/cms/company/fuel-way").get(getFuelWay).patch(updateFuelWay);
// router.route("/cms/company/auto-gulf").get(getAutoGulf).patch(updateAutoGulf);

// router
// 	.route("/cms/company/saudi-drill")
// 	.get(getSaudiDrill)
// 	.patch(updateSaudiDrill);

// router
// 	.route("/cms/company/saudi-falcon")
// 	.get(getSaudiaFalcon)
// 	.patch(updateSaudiaFalcon);

// router
// 	.route("/cms/company/header")
// 	.get(getCompamiesHeader)
// 	.patch(updateCompaniesHeader);

// router.patch("/cms/company/:id?", updateCompanyList);
// router.get("/cms/company", getCompanyList);

router
	.route("/cms/gallery/category")
	.post(createGalleryCategory)
	.get(getGalleryCategories);
router
	.route("/cms/gallery/category/:categoryId")
	.patch(updateGalleryCategory)
	.get(getGalleryCategory)
	.delete(deleteGalleryCategory);

router.route("/cms/gallery").get(getGallery).patch(updateGallery);
// router.patch("/cms/gallery/:id?", updateGallery);
// router.get("/cms/gallery", getGallery);

router
	.route("/cms/social/header/:id?")
	.get(getSocialHeader)
	.patch(updatedSocialHeader);

router.route("/cms/social/form").post(createSocialMember).get(getMembers);
router
	.route("/cms/social/form/:memberId")
	.get(getMember)
	.patch(updateSocialMember)
	.delete(deleteMember);

// router.route("/cms/social").get(getSocial).patch(updateSocial);
// router.patch("/cms/social/:id?", updateSocial);
// router.get("/cms/social", getSocial);

router
	.route("/cms/home/header/:id?")
	.patch(updateHomeHeader)
	.delete(deleteHomeHeader);
router.get("/cms/home/header", getHomeHeader);

router
	.route("/cms/home/statistics/:id?")
	.patch(updateStatistics)
	.delete(deleteHomeStatistics);
router.get("/cms/home/statistics", getStatistics);

router
	.route("/cms/home/timeLine/header/:id?")
	.patch(updateTimeLineHeader)
	.get(getTimeLineHeader);

router
	.route("/cms/home/timeLine/:id?")
	.patch(updateTimeLine)
	.delete(deleteHomeTimeLine);
router.get("/cms/home/timeLine", getTimeLine);

router
	.route("/cms/home/industry/:id?")
	.patch(updateIndustry)
	.delete(deleteHomeIndustry);
router.get("/cms/home/industry", getIndustry);

router
	.route("/cms/home/partner/:id?")
	.patch(updatePartner)
	.delete(deleteHomePartner);
router.get("/cms/home/partner", getPartner);
// router.patch("/cms/home/partner/rearrange/order", updatePartnerOrder);

router.patch("/cms/home/message/:id?", updateMessage);
router.get("/cms/home/message", getMessage);

router.patch("/cms/home/about/:id?", updateAboutMessage);
router.get("/cms/home/about", getAboutMessage);

router.patch("/cms/home/news/:id?", updateNews);
router.get("/cms/home/news", getNews);

router.patch("/cms/home/:id?", updateHome);
router.get("/cms/home", getHome);

/// ignored
router.route("/cms/news").get(getNews).patch(updateNews);
//////////////////

router
	.route("/controls")
	.post(createControls)
	.patch(updatedControls)
	.get(getControls);

router
	.route("/setting/social/:id?")
	.get(getSocialMedia)
	.patch(updateSocialMedia);

router.get("/setting/emails", getEmails);
router.route("/setting/sender").patch(updateSenderEmail);
router.patch("/setting/receiver/add", addReceiverEmail);
router.patch("/setting/receiver/remove", deleteReceiverEmail);

router.get("/dashboard/cards", getCardsData);
router.get("/dashboard/chart", getChartData);

module.exports = router;

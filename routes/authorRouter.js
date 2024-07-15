const express = require("express");

const router = express.Router();

const {
	getAuthenticatedUser,
	updateUserProfile,
	resetPassword,
} = require("../controllers/userController");

const {
	createPost,
	getPost,
	updatePost,
	deletePost,
	getDraftedPosts,
	getPublishedPosts,
	togglePostStatus,
} = require("../controllers/blogController");

const {
	createTag,
	getTags,
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
} = require("../controllers/categoryController");

const { uploadImage } = require("../middlewares/uploadImageMiddlewar");
const { pagination } = require("../middlewares/paginationMiddleware");

router.get("/user/auth", getAuthenticatedUser);
router.patch("/user/profile", updateUserProfile);
router.patch("/user/reset-password", resetPassword);

router.get("/blog/draft", pagination, getDraftedPosts);
router
	.route("/blog")
	.get(pagination, getPublishedPosts)
	.post(uploadImage, createPost);
router.patch("/blog/status/:postId", togglePostStatus);
router.route("/blog/:postId").get(getPost).patch(updatePost).delete(deletePost);

router
	.route("/tag")
	.get(pagination, getTags)
	.post(createTag)
	.delete(deleteMenyTags);
router.route("/tag/:tagId").get(getTag).patch(updateTag).delete(deleteTag);

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

module.exports = router;

const { getBoard } = require("./BoardController");
const { getCompanyList } = require("./CompanyListController");
const { getGallery } = require("./GalleryController");
const { getHome, getAboutMessage } = require("./HomeController");
const { getNews, getPost, filterPosts } = require("./NewsController");
const { getSocial } = require("./SocialController");
const { getTeamSection } = require("./TeamController");
const { getWhoAre } = require("./whoweareController");

const {
	Home,
	HomeHeader,
	Statistics,
	TimeLine,
	Industry,
	Partner,
	Message,
	About,
	TimeLineHeader,
} = require("../../models/CMS/HomeModel");
const { WhoWeAre } = require("../../models/CMS/whowheareModel");
const { Board } = require("../../models/CMS/BoardModel");
const Blog = require("../../models/blogModel");

const ApiError = require("../../util/ApiError");
const { host } = require("../../constants/host");

// const getLandingPage = async (req, res, next) => {
// 	try {
// 		// const home = await Home.findOne()
// 		//       .populate({
// 		//             path: "header statistics timeLine industries partners message",
// 		//             select: "-_id -__v",
// 		//       })
// 		//       .lean();

// 		let header = await HomeHeader.find({}).select("-_id");
// 		let statistics = await Statistics.find({}).select("-_id");
// 		let timeLine = await TimeLine.find({}).select("-_id");
// 		let industries = await Industry.find({}).select("-_id");
// 		let partners = await Partner.find({}).select("-_id");
// 		let message = await Message.find({}).select("-_id");

// 		// if (!home) {
// 		//       return res.status(200).json({
// 		//             status: "success",
// 		//             result: [],
// 		//             success: true,
// 		//             message: "No Data",
// 		//       });
// 		// }

// 		const whoweare = await WhoWeAre.findOne()
// 			.populate({
// 				path: "images",
// 				select: "-_id",
// 			})
// 			.select("-_id title content image")
// 			.lean();

// 		// const about = await About.findOne()
// 		// 	.populate("images")
// 		// 	.select("-_id title content images")
// 		// 	.lean();

// 		// const board = await Board.findOne().select("-_id message").lean();

// 		const posts = await Blog.find({ isPublished: true })
// 			.select("_id image title createdAt")
// 			.limit(3)
// 			.sort({ createdAt: -1 });

// 		header = header.map((h) => {
// 			return {
// 				label: h.label,
// 				// labelAr: h.labelAr,
// 				image: `${res.locals.baseUrl}/uploads/cms/home/${h.image}`,
// 			};
// 		});

// 		timeLine = timeLine.map((t) => {
// 			return {
// 				year: t.year,
// 				label: t.label,
// 				image: `${res.locals.baseUrl}/uploads/cms/home/${t.image}`,
// 			};
// 		});

// 		industries = industries.map((s) => {
// 			return {
// 				label: s.label,
// 				link: s.link,
// 				image: `${res.locals.baseUrl}/uploads/cms/home/${s.image}`,
// 			};
// 		});

// 		partners = partners.map((p) => {
// 			return {
// 				image: `${res.locals.baseUrl}/uploads/cms/home/${p.image}`,
// 			};
// 		});

// 		message = message.map((m) => {
// 			return {
// 				name: m.name,
// 				nameAr: m.nameAr,
// 				content: m.content,
// 				contentAr: m.contentAr,
// 				image: `${res.locals.baseUrl}/uploads/cms/home/${m.image}`,
// 			};
// 		});

// 		const postsFormated = posts.map((p) => {
// 			return {
// 				_id: p._id,
// 				title: p.title,
// 				createdAt: p.createdAt,
// 				image: `${res.locals.baseUrl}/uploads/blog/${p.image}`,
// 			};
// 		});

// 		// about.images = about.images.map((image) => {
// 		// 	return {
// 		// 		image: `${res.locals.baseUrl}/uploads/home/${image.image}`,
// 		// 	};
// 		// });

// 		whoweare.images = whoweare.images.map((image) => {
// 			return {
// 				image: `${res.locals.baseUrl}/uploads/cms/whoweare/${image.image}`,
// 			};
// 		});

// 		// board.message.image = `${res.locals.baseUrl}/uploads/cms/board/${board.message.image}`;

// 		const formatedLandingPage = {
// 			header: header || [],
// 			whoweare: { ...whoweare } || [],
// 			// about: { ...about } || [],
// 			statistics: statistics || [],
// 			message: message || [],
// 			timeLine: timeLine || [],
// 			industries: industries || [],
// 			partners: partners || [],
// 			posts: postsFormated || [],
// 		};

// 		return res.status(200).json({
// 			status: "success",
// 			result: formatedLandingPage,
// 			success: true,
// 			message: "success",
// 		});
// 	} catch (error) {
// 		next(new ApiError("somthing went wrong " + error, 500));
// 	}
// };

const getLandingPage = async (req, res, next) => {
	try {
		let header = await HomeHeader.find({}).select("-_id");
		let statistics = await Statistics.find({}).select("-_id");
		let timeLine = await TimeLine.find({}).select("-_id").sort({ year: 1 });
		let industries = await Industry.find({}).select("-_id");
		let partners = await Partner.find({}).sort({ order: 1 }).select("-_id");
		let message = await Message.find({}).select("-_id");
		const timeLineHeader = await TimeLineHeader.findOne();

		const about = await About.findOne()
			.populate("images")
			.select("-_id")
			.lean();

		// const whoweare = await WhoWeAre.findOne()
		// 	.populate({
		// 		path: "images",
		// 		select: "-_id",
		// 	})
		// 	.select("-_id title content image")
		// 	.lean();

		const posts = await Blog.find({ isPublished: true })
			.select("_id image title createdAt")
			.limit(3)
			.sort({ createdAt: -1 });

		header = header.map((h) => ({
			label: req.lang === "ar" ? h.labelAr : h.label,
			image: h.image
				? `${res.locals.baseUrl}/uploads/cms/home/${h.image}`
				: null,
			video: h.video
				? `${res.locals.baseUrl}/uploads/cms/home/${h.video}`
				: null,
		}));

		statistics = statistics.map((s) => ({
			label: req.lang === "ar" ? s.labelAr : s.label,
			value: req.lang === "ar" ? s.valueAr : s.value,
			image: `${res.locals.baseUrl}/uploads/cms/home/${s.image}`,
		}));

		const timeLineTitle =
			req.lang === "ar" ? timeLineHeader.titleAr : timeLineHeader.title;

		const timeLineParagraph =
			req.lang === "ar" ? timeLineHeader.paragraphAr : timeLineHeader.paragraph;

		timeLine = timeLine.map((t) => ({
			year: req.lang === "ar" ? t.yearAr : t.year,
			label: req.lang === "ar" ? t.labelAr : t.label,
			image: `${res.locals.baseUrl}/uploads/cms/home/${t.image}`,
		}));

		industries = industries.map((s) => ({
			label: req.lang === "ar" ? s.labelAr : s.label,
			link: s.link,
			image: `${res.locals.baseUrl}/uploads/cms/home/${s.image}`,
		}));

		partners = partners.map((p) => ({
			image: `${res.locals.baseUrl}/uploads/cms/home/${p.image}`,
		}));

		message = message.map((m) => ({
			name: req.lang === "ar" ? m.nameAr : m.name,
			content: req.lang === "ar" ? m.contentAr : m.content,
			image: `${res.locals.baseUrl}/uploads/cms/home/${m.image}`,
		}));

		const postsFormated = posts.map((p) => ({
			_id: p._id,
			title: p.title,
			createdAt: p.createdAt,
			image: `${res.locals.baseUrl}/uploads/blog/${p.image}`,
		}));

		const aboutTitle = req.lang === "ar" ? about.titleAr : about.title;
		const aboutContent = req.lang === "ar" ? about.contentAr : about.content;

		about.images = about.images.map((image) => ({
			image: `${res.locals.baseUrl}/uploads/cms/home/${image.image}`,
		}));

		const formatedLandingPage = {
			header: header || [],
			whoweare:
				{ images: about.images, title: aboutTitle, content: aboutContent } ||
				[],
			statistics: statistics || [],
			message: message || [],
			timeLineHeader: {
				timeLineTitle,
				timeLineParagraph,
			},
			timeLine: timeLine || [],
			industries: industries || [],
			partners: partners || [],
			posts: postsFormated || [],
		};

		return res.status(200).json({
			status: "success",
			result: formatedLandingPage,
			success: true,
			message: "success",
		});
	} catch (error) {
		next(new ApiError("Something went wrong: " + error, 500));
	}
};

module.exports = {
	getLandingPage,
	getBoard,
	getCompanyList,
	getGallery,
	getHome,
	getNews,
	getPost,
	filterPosts,
	getSocial,
	getTeamSection,
	getWhoAre,
	getAboutMessage,
};

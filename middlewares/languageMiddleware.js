const determineLanguage = (req, res, next) => {
	const language =
		req.query.lang || req.body.lang || req.headers["accept-language"];

	const supportedLanguages = ["en", "ar"];
	const defaultLanguage = "en";

	req.lang = supportedLanguages.includes(language) ? language : defaultLanguage;

	next();
};

module.exports = determineLanguage;

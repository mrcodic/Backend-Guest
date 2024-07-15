const { host } = require("../constants/host");

exports.processImage = (res, doc, folder) => {
	if (doc.cvFile) {
		const imageName = doc.cvFile;
		const imageUrl = `${res.locals.baseUrl}/uploads/${folder}/${imageName}`;

		return imageUrl;
	}

	if (doc.image) {
		const imageName = doc.image;
		const imageUrl = `${res.locals.baseUrl}/uploads/${folder}/${imageName}`;

		return imageUrl;
	}
	return null;
};

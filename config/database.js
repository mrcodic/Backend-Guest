const mongoose = require("mongoose");

const dbConnection = () => {
	mongoose.connect(process.env.DB_URI_2).then((con) => {
		console.log(`Database Connected: ${con.connection.host}`);
	});
};

module.exports = dbConnection;

const http = require("http");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config({ path: "config.env" });

const server = http.createServer(app);

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
	console.log(`Server is Running on Port: ${PORT}`);
});

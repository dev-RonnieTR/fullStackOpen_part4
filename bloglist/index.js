const app = require("./app");
const config = require("./utils/config");

const { PORT } = config;

app.listen(PORT, () => {
	console.log("Connected to server on PORT", PORT);
});

const app = require("./app");
const config = require("./utils/config");
const logger = require("./utils/logger");

const { PORT } = config;

app.listen(PORT, () => {
	logger.info("Server running on PORT:", PORT);
});

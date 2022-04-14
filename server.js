const app = require("./index");
const logger = require("./logger/logger");

const port = process.env.PORT || 5678;

const server = () => {
  try {
    app.listen(port, () => {
      logger.info(`Server is running on port ${port}`);
    });
  } catch (error) {
    logger.error(error);
  }
};

server();

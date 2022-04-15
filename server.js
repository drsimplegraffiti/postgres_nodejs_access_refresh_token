const app = require("./index");
const logger = require("./logger/logger");
const fs = require("fs");
const path = require("path");
const https = require("https");

const port = process.env.PORT || 5678;

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
  },
  app
);

sslServer.listen(port, () => {
  try {
    logger.info(`Server is running on port ${port}`);
  } catch (error) {
    logger.error(error);
  }
});

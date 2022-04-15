const colors = require('colors');

const createDefaultTables = require('./scripts/create-table');
const app = require('./index');
const logger = require('./logger/logger');
const fs = require('fs');
const path = require('path');
const https = require('https');

const port = process.env.PORT || 5678;

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
    cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
  },
  app
);

//Timezone
process.env.TZ = 'Africa/Lagos';

sslServer.listen(port, async () => {
  try {
    await createDefaultTables();
    logger.info(`Server is running on port ${port}`.yellow);
  } catch (error) {
    logger.error(error);
  }
});

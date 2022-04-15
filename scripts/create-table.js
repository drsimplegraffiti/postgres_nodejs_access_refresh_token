const fs = require("fs-extra");

const path = require("path");

const pool = require("../db/db.js");

const sqlFilePath = path.join(__dirname, ".", "../database.sql");

const createDefaultTables = async () => {
  try {
    const sqlCommandsBuffer = await fs.readFile(sqlFilePath);
    const sqlCommands = sqlCommandsBuffer.toString();
    await pool.query(sqlCommands);
    console.log(`✅ Default tables are  created.`);
  } catch (error) {
    console.log(error);
    console.log(`❌ Default tables are not created.`);
  }
};
module.exports = createDefaultTables;

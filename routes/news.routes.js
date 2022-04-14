const express = require("express");
const pool = require("../db/db");
const logger = require("../logger/logger");
const { authenticateToken } = require("../middleware/authorization");
const router = express.Router();

let refreshTokens = [];
/*
 * @route GET /api/vi/users
 * @desc Get all users
 * @access Public
 * @returns {JSON}
 * @returns {String} message
 */
router.get("/", authenticateToken, async (req, res) => {
  try {
    const news = await pool.query("SELECT * FROM news");
    res.json({ news: news.rows });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

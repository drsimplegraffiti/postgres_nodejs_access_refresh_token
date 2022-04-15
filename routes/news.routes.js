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

router.post("/", async (req, res) => {
  try {
    const { headline, body } = req.body;
    const news = await pool.query(
      "INSERT INTO news (headline, body) VALUES ($1, $2) RETURNING *",
      [headline, body]
    );
    res.json({
      message: "News created successfully",
      news: news.rows[0],
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});
router.get("/:news_id", async (req, res) => {
  try {
    const { news_id } = req.params;
    const singleNews = await pool.query("SELECT * FROM news WHERE news_id=$1", [
      news_id,
    ]);
    res.status(200).json({ news: singleNews.rows });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put("/:news_id", async (req, res) => {
  try {
    const { news_id } = req.params;
    const { headline, body } = req.body;
    const updates = await pool.query(
      `UPDATE news SET headline =$1, body=$2 WHERE news_id =$3`,
      [headline, body, news_id]
    );
    return res.status(200).json(updates.rows);
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete("/:news_id", async (req, res) => {
  try {
    const { news_id } = req.params;
    const deletedNews = await pool.query(`DELETE FROM news WHERE news_id =$1`, [
      news_id,
    ]);

    return res
      .status(200)
      .json({ message: "Deleted successfully", data: deletedNews.rowCount });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;

const express = require('express');
const pool = require('../db/db');
const logger = require('../logger/logger');
const { authenticateToken } = require('../middleware/authorization');
const { validateNews } = require('../utils/validations');

const router = express.Router();

let refreshTokens = [];
/*
 * @route GET /api/vi/users
 * @desc Get all users
 * @access Public
 * @returns {JSON}
 * @returns {String} message
 */
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    const news = await pool.query(
      `SELECT * FROM news Order By news_id LIMIT 5 OFFSET (${(page - 1) * 5})`
    );
    if (news.rows[0] == null || !news.rows[0] || news.rows[0] == []) {
      return res.status(404).json({
        message: `Page Not Found.....`,
      });
    }
    dataCount = news.rows.length;
    res.json({
      news: news.rows,
      pageInfo: `Page ${page} of ${Math.ceil(dataCount / 5)}`,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { headline, body } = req.body;
    const validateData = await validateNews.validateAsync(req.body);

    const news = await pool.query(
      'INSERT INTO news (headline, body) VALUES ($1, $2) RETURNING *',
      [headline, body]
    );
    res.json({
      message: 'News created successfully',
      news: news.rows[0],
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});
router.get('/:news_id', async (req, res) => {
  try {
    const { news_id } = req.params;
    const checkIfIdExists = await pool.query('SELECT * FROM news');
    if (news_id != checkIfIdExists.rows) {
      return res.status(404).json({ error: `${news_id} not found` });
    }
    const singleNews = await pool.query('SELECT * FROM news WHERE news_id=$1', [
      news_id,
    ]);
    res.status(200).json({ news: singleNews.rows });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.put('/:news_id', async (req, res) => {
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

router.delete('/:news_id', async (req, res) => {
  try {
    const { news_id } = req.params;
    const deletedNews = await pool.query(`DELETE FROM news WHERE news_id =$1`, [
      news_id,
    ]);
    const isDeleted = deletedNews.rowCount > 0;
    if (isDeleted) {
      res.status(204).send();
    } else {
      return res.status(404).send({
        message: 'news not found therefore there is nothing to done.',
      });
    }
    return res
      .status(200)
      .json({ message: 'Deleted successfully', data: deletedNews.rowCount });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const newsBody = await pool.query(
      'SELECT * FROM news WHERE body ILIKE $1;',
      [`%${req.query.body || ''}%`]
    );
    res.send(newsBody.rows);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;

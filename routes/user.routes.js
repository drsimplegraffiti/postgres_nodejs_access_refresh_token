const express = require('express');
const pool = require('../db/db');
const logger = require('../logger/logger');
const bcrypt = require('bcrypt');
const transporter = require('../mail/mailer');
const router = express.Router();

/*
 * @route GET /api/vi/users
 * @desc Get all users
 * @access Public
 * @returns {JSON}
 * @returns {String} message
 */
router.get('/', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json({ users: users.rows });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

/*
 * @route POST /api/v1/users
 * @desc Create a new user
 * @access Public
 * @returns {JSON}
 * @returns {String} message
 */
router.post('/', async (req, res) => {
  try {
    const { user_name, user_password, user_email } = req.body;
    if (!user_name || !user_password || !user_email) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user_password, salt);
    const newUser = await pool.query(
      'INSERT INTO users (user_name, user_password, user_email) VALUES ($1, $2, $3) RETURNING *',
      [user_name, hashedPassword, user_email]
    );
    let info = await transporter.sendMail({
      from: 'drsimplegraffiti@gmail.com', // sender address
      to: user_email, // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'You just registered on our platform', // plain text body
      html: `You just registered on our platform your user details: ${newUser.rows[0].user_id}`, // html body
    });
    res.json({
      message: 'User created successfully',
      user: newUser.rows[0],
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

const express = require('express');
const pool = require('../db/db');
const logger = require('../logger/logger');
const bcrypt = require('bcrypt');
const transporter = require('../mail/mailer');
const { validateReg } = require('../utils/validations');
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
    const validateData = await validateReg.validateAsync(req.body);
    // const emailExists = await pool.query(
    //   'SELECT * users WHERE user_email = $1 RETURNING *',
    //   [user_email]
    // );
    // console.log(emailExists);
    // if (emailExists) {
    //   return res.status(400).json({
    //     message: '  This email already exist, pls log in',
    //   });
    // }
    if (!user_name || !user_password || !user_email) {
      return res.status(400).json({ error: 'Please fill all fields' });
    }
    if (user_password.length < 8) {
      return res.status(403).json({
        message: 'Password too short.',
      });
    }
    if (
      user_password.includes(user_name) ||
      user_password.includes(user_email)
    ) {
      return res.status(403).json({
        message: 'Password too Weak',
      });
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

router.get('/total_users', async (req, res) => {
  try {
    const countUsers = await pool.query('SELECT COUNT(*) FROM users;');
    return res.status(200).json({ number_of_users: countUsers.rows });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;

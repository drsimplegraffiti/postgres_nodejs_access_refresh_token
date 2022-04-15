const express = require('express');
const pool = require('../db/db');
const logger = require('../logger/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtTokens } = require('../utils/jwt-helpers');
const { validateLogin } = require('../utils/validations');

const router = express.Router();

/* 
  * @route POST /api/auth/login
  * @desc Login user
  * @access Public
  * @returns {JSON}
  * @returns {String} message
  * @returns {String} token
  * 
  * @returns {String} error
  * @returns {String} error.message

*/
//handle Login
router.post('/login', async (req, res) => {
  try {
    const { user_email, user_password } = req.body;
    const validateData = await validateLogin.validateAsync(req.body);

    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [
      user_email,
    ]);
    if (user.rows.length === 0) {
      return res.status(401).json({
        message: 'Email not found',
      });
    }

    //Checking password
    const isMatch = await bcrypt.compare(
      user_password,
      user.rows[0].user_password
    );
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }

    //Generate JWT
    // const token = jwtTokens({
    //   user_id: user.rows[0].user_id,
    //   user_name: user.rows[0].user_name,
    //   user_email: user.rows[0].user_email,
    // });
    let tokens = jwtTokens(user.rows[0]);
    res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true });

    return res.status(200).json({
      message: 'Login successful',
      token: tokens,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.get('/refresh_token', (req, res) => {
  try {
    const refreshToken = req.cookies.refresh_token;
    console.log(
      '🚀 ~ file: auth.routes.js ~ line 68 ~ router.get ~ refreshToken',
      refreshToken
    );
    if (refreshToken === null)
      return res.status(401).json({ error: 'Null refresh token' });
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(401).json({ error: 'Invalid refresh token' });
      let tokens = jwtTokens(user);
      res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true }); //if the backend is separated from the frontend, use res.cookie('refresh_token', tokens.refreshToken, { httpOnly: true,sameSite:'none' secure: true });
      return res.status(200).json({
        message: 'Refresh token successful',
        token: tokens,
      });
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/refresh_token', (req, res) => {
  try {
    res.clearCookie('refresh_token');
    return res.status(200).json({
      message: 'Refresh token deleted',
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ error: error.message });
  }
});
module.exports = router;

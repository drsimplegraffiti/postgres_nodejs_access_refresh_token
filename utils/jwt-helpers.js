const jwt = require("jsonwebtoken");

function jwtTokens({ user_id, user_name, user_email }) {
  const user = { user_id, user_name, user_email };
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "20s", //use 15minutes in production
  });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "5m", //use 1 week in production
  });
  return { accessToken, refreshToken };
}

module.exports = { jwtTokens };

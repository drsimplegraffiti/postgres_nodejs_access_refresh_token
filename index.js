const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
dotenv.config();

const app = express();

const corsOptions = {
  credentials: true,
  origin: process.env.URL || '*',
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => res.status(200).json('Home page'));
app.use('/api/v1/users', require('./routes/user.routes'));
app.use('/api/v1/auth', require('./routes/auth.routes'));
app.use('/api/v1/news', require('./routes/news.routes'));

module.exports = app;

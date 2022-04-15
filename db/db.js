const pg = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const { Pool } = pg;

const { DATABASE_PASSWORD } = process.env;

const localPoolConfig = {
  user: 'postgres',
  host: 'localhost',
  database: 'jwtnode',
  password: DATABASE_PASSWORD,
  port: 5432,
  max: 10, //*
  idleTimeoutMillis: 30000, //*
  connectionTimeoutMillis: 2000, //*
};

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : localPoolConfig;

const pool = new Pool(poolConfig);

module.exports = pool;

const {Pool} = require('pg');
const dotenv = require('dotenv');
dotenv.config();
const pool = new Pool({
    database: process.env.DB_NAME || 'spybase',
    user: "postgres",
    password: process.env.DB_PASSWORD || '1111',
    port: process.env.DB_PORT || 5432,
})

module.exports = pool;
const { Pool } = require("pg");
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "shoes_db",
    // Sửa pass theo máy của mình
    password: "ngocvinh",
    port: 5432,
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};
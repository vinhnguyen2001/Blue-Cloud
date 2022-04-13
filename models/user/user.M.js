const db = require('../db');

exports.getUserById = async(u_id) => {
    let user = await db.query(`select * from users where user_id = ${u_id}`);
    return user.rows[0];
};
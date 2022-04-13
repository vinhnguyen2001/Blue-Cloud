const pool = require('../db')
const tableName = "public.users";


const getAll = async function() {
    const data = await pool.query(`SELECT * FROM ${tableName}`);
    return data.rows;
}

const getOne = async function(fieldName, value) {
    const data = await pool.query(`SELECT * FROM ${tableName}  WHERE "${fieldName}"=  '${value}'`);
    return data.rows;
}

const addOne = async function(username, fullName, phoneNumber, password) {
    // Sửa số 0 thành số 1 để ra owner
    const user = await pool.query(
        `INSERT INTO ${tableName}
     ("username", "fullname", "phone", "pwd", "role_id")
      VALUES ('${username}', '${fullName}','${phoneNumber}', '${password}',0)
      Returning *`);

    return user.rows;
}

module.exports = { getAll, getOne, addOne };
const db = require('../db');
const tableName = "public.carts";
const cartContent = "public.cart_content";


const addOneCarts = async(idUser) => {
    const data = await db.query(`
    INSERT INTO ${tableName}
    ("user_id")
    VALUES ('${idUser}')
    RETURNING *`);

    return data.rows;
}
const getCartId = async(user_id) => {
    const cart_id = await db.query(`SELECT cart_id FROM ${tableName} WHERE "user_id" = '${user_id}'`);
    return cart_id.rows[0].cart_id;
};

const getQuantityByUserId = async(user_id) => {

    // console.log("user_id", user_id);
    const { rows } = await db.query(`
    SELECT count(*) FROM ${tableName} C JOIN ${cartContent} CT
    ON C.cart_id = CT.cart_id
    WHERE C.user_id = '${user_id}' `);

    return rows;
}

module.exports = {
    addOneCarts,
    getCartId,
    getQuantityByUserId,
};
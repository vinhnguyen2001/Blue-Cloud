const db = require('../db');
const orderTable = "public.orders";

exports.addRow = async(ID, total, phone, address, status) => {
    const { rows } = await db.query(`
    INSERT INTO ${orderTable}
    ("user_id", "total", "order_time", "order_phone", "address", "status")
    VALUES ('${ID}', ${total}, NOW()::timestamp,'${phone}','${address}','${status}')   
    RETURNING *`);

    return rows;
}

exports.getAllUserOrder = async(u_id) => {
    let ods = await db.query(`select * from orders where user_id = ${u_id} 
    order by order_time DESC;`);
    return ods.rows;
}

exports.getOneUserOrder = async(o_id) => {
    let odrer = await db.query(`select * from orders where order_id = ${o_id}`);
    return odrer.rows[0];
};
exports.getUserOrderContent = async(o_id) => {
    let o_content = await db.query(`
    SELECT * FROM order_content O JOIN SHOES S
    ON O.shoes_id = S.shoes_id
    where O.order_id = ${o_id} 
    order by O.shoes_id;`);
    return o_content.rows;
}
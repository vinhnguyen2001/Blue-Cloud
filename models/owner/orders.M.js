const db = require('../db');
const { getOrder } = require('./ordersDetail.M');

// Xác định vị trí của phần tử
const indexOfSize = (sizes, value) => {
    let i = 0;
    for (; i < sizes.length; i++) {

        if (sizes[i] == value) {
            break;
        }
    }
    return i + 1;
};

const totalItems = async(search) => {

    const { rows } = await db.query(`
    SELECT count(*)
    FROM orders O, users U
    WHERE O.user_id = U.user_id
    AND O.order_phone like '%${search}%'
    `);

    return rows[0].count;
}

exports.getOrders = async({ page, per_page = 10, search }) => {

    const offset = (page - 1) * per_page;
    const { rows } = await db.query(`
    select orders.order_id,users.username,orders.total,orders.order_time,orders.address, orders.order_phone,orders.status
    from orders, users 
    where orders.user_id = users.user_id 
    AND orders.order_phone like '%${search}%'
    order by orders.status, orders.order_id
    LIMIT ${per_page} OFFSET ${offset}`);

    const total_items = await totalItems(search);
    const total_page = total_items % per_page === 0 ? (total_items / per_page) : Math.floor(total_items / per_page) + 1;

    return { items: rows, total_page: total_page };

}

exports.priceForShow = function(price) {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}

exports.cancelOrder = async(o_id) => {
    // Cập nhật lại trạng thái hóa đơn
    let cancelRow = (await db.query(`update orders set status = 2 where order_id = ${o_id} returning *;`)).rows[0];
    let o_content = await getOrder(o_id);

    // Thêm lại số lượng sản phẩm trong hóa đơn bị hủy vào kho
    for (let content of o_content) {
        let s_id = content.shoes_id;
        let reStock = content.quantity;
        let { rows } = await db.query(`SELECT * FROM shoes WHERE "shoes_id" = '${s_id}'`);
        let index = indexOfSize(rows[0].size, content.orc_size);


        let newStock = parseInt(rows[0].stock[index - 1]) + parseInt(reStock);
        const newRow = await db.query(`update shoes set stock[${index}] = ${newStock} where "shoes_id" = '${s_id}'
        RETURNING*;`);

    }

    return cancelRow;
}

exports.updateOrder = async(o_id, o_phone, o_address, o_status) => {
    let updateRow = (await db.query(`update orders set order_phone = '${o_phone}', address = '${o_address}', status = ${o_status}
    where order_id = ${o_id} returning *;`)).rows[0];
    return updateRow;
}
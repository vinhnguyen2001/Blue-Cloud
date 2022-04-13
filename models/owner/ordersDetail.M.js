const db =require('../db');


exports.getOrder = async (id) =>{
    const pds = await db.query('select * from order_content where order_content.order_id = ' + id)
    return pds.rows;
}

exports.getOrdertotal = async (id) =>{
    const pds = await db.query('select * from orders where orders.order_id = ' + id)
    return pds.rows[0];
}
exports.priceForShow = function(price) {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g,'$1,');
}

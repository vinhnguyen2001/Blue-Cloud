const db = require('../db');
const orContentTable = "public.order_content";

exports.addRowOrContent = async(strQuery) => {
    const { rows } = await db.query(`
    INSERT INTO ${orContentTable}
    (order_id, shoes_id, orc_size, price, quantity)
    VALUES ${strQuery}
    RETURNING *`);

    return rows;
}

const year = new Date().getFullYear();

exports.countShoeSoldByMonthAndBrand = async(month, brand) => {

    const { rows } = await db.query(`
    SELECT SUM(OC.quantity) AS total
    FROM orders O, order_content OC, shoes S
    WHERE O.order_id = OC.order_id
    AND status = 1 AND date_part('month',O.order_time) = ${month}
    AND S.brand_id =${brand} AND S.shoes_id = OC.shoes_id
    AND  date_part('year',O.order_time) = ${year}
    `)
    return rows[0].total;

}
exports.countShoeSoldByMonth = async(month) => {

    const { rows } = await db.query(`
    SELECT SUM(OC.quantity) AS total
    FROM orders O, order_content OC
    WHERE O.order_id = OC.order_id AND  date_part('year',O.order_time) = ${year}
    AND status = 1 AND date_part('month',O.order_time) = ${month}
    `)
    return rows[0].total;

}
exports.countTotalShoes = async(brand) => {

    const { rows } = await db.query(`
    SELECT SUM(OC.quantity) AS total
    FROM orders O, order_content OC, shoes S
    WHERE O.order_id = OC.order_id
    AND status = 1 AND  date_part('year',O.order_time) = ${year}
    AND S.brand_id =${brand} AND S.shoes_id = OC.shoes_id
    `);

    return rows[0].total;

}
exports.countTotalPriceByMonth = async(month) => {

    const { rows } = await db.query(`
    SELECT SUM(O.total) AS total
    FROM orders O
    WHERE date_part('year',O.order_time) = ${year}
    AND status = 1 AND date_part('month',O.order_time) = ${month}
    `);

    return rows[0].total;
}
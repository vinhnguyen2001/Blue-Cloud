const db = require('../db');
const tableName = "public.shoes";
const { getOrder } = require('../owner/ordersDetail.M');

const indexOfSize = (sizes, value) => {
    let i = 0;
    for (; i < sizes.length; i++) {

        if (sizes[i] == value) {
            break;
        }
    }
    return i + 1;
};

const totalItems = async(brandID) => {

    const { rows } = await db.query(`
    SELECT count(*) FROM ${tableName}
    WHERE "brand_id" = '${brandID}'
    AND "state"='true'
    `)

    return rows[0].count;
}

exports.reduceStockShoe = async(ID) => {
    // Cập nhật lại trạng thái hóa đơn
    let o_content = await getOrder(ID);

    // Thêm lại số lượng sản phẩm trong hóa đơn bị hủy vào kho
    for (let content of o_content) {
        let s_id = content.shoes_id;
        let reStock = content.quantity;
        let { rows } = await db.query(`SELECT * FROM shoes WHERE "shoes_id" = '${s_id}'`);
        let index = indexOfSize(rows[0].size, content.orc_size);

        let newStock = parseInt(rows[0].stock[index - 1]) - parseInt(reStock);
        const newRow = await db.query(`update shoes set stock[${index}] = ${newStock} where "shoes_id" = '${s_id}'
       RETURNING*;`);
    }

    return true;
}

exports.getShoesById = async(firstID, secondID, thirdID, fourthID, fifthID, brand_id) => {

    const { rows } = await db.query(`SELECT * FROM ${tableName} 
    WHERE  "shoes_id" = '${firstID}' OR "shoes_id" = '${secondID}' OR "shoes_id" = '${thirdID}'
    OR "shoes_id" = '${fourthID}' OR "shoes_id" = '${fifthID}' AND "brand_id" = '${brand_id}'
    `)
    return rows;
}

exports.priceForShow = function(price) {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}


exports.getShoesInBrand = async({ page = 1, per_page = 8, brandID }) => {

    const offset = (page - 1) * per_page;
    const { rows } = await db.query(`
    SELECT * FROM ${tableName}
    WHERE "brand_id" = '${brandID}' AND "state"='true'
    ORDER BY "shoes_id" DESC
    LIMIT $1 OFFSET $2
    `, [per_page, offset]);

    const total_items = await totalItems(brandID);
    const total_page = total_items % per_page === 0 ? (total_items / per_page) : Math.floor(total_items / per_page) + 1;

    return { total_page: total_page, items: rows };
}
exports.getShoes = async(id) => {
    const pds = await db.query('select * from shoes where shoes_id = ' + id)

    return pds.rows[0];
}

exports.getShoe = async({ page = 1, per_page = 6, search, price, sizes }) => {

    const offset = (page - 1) * per_page;
    const { rows } = await db.query(`
    SELECT * FROM SHOES WHERE "STATE"='true' AND "SHOES_NAME" like '%${search}%'
    AND "PRICE" BETWEEN 0 AND ${price} AND '${sizes}'
    `);


};

const countShoes = async({ search, price, sizes }) => {
    const { rows } = await db.query(`
    SELECT count(*) FROM SHOES WHERE "state"='true' AND "shoes_name" like '%${search}%'

    `);

    return rows[0].count;
}

exports.getShoesByName = async({ page = 1, per_page = 8, search, price, sizes }) => {

    const offset = (page - 1) * per_page;
    // console.log("price:", price);
    // console.log("sizes:", sizes);

    const { rows } = await db.query(`
    SELECT * FROM SHOES 
    WHERE "state"='true' 
    AND "shoes_name" like '%${search}%'
    ${price} ${sizes}
    ORDER BY "price" DESC`);
    // LIMIT $1 OFFSET $2`, [per_page, offset]);

    // const totalShoes = await countShoes({ search, price, sizes }); total_page: totalPage,

    // const totalPage = totalShoes % per_page === 0 ? totalShoes / per_page : Math.floor(totalShoes / per_page) + 1;
    // console.log("total: ", rows);

    const totalPage = 1;
    return { items: rows };
}
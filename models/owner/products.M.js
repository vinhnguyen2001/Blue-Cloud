const db = require('../db');
const tableName = "public.shoes";


exports.updateOneRow = async({ ID, name, image, brand_id, size, price, stock }) => {

    const { rows } = await db.query(`
    UPDATE ${tableName}
	SET "shoes_name" ='${name}', "image"='${image}', "brand_id"='${brand_id}', "size"='${size}', "price"='${price}', "stock"='${stock}'
	WHERE "shoes_id"='${ID}'
    RETURNING *;`)

    return rows[0];
};


exports.getShoeByIdOwner = async(id) => {

    const { rows } = await db.query(`SELECT * 
    FROM ${tableName}
    WHERE "state"='true' AND "shoes_id"='${id}'
    `)
    return rows[0];
}

exports.totalItemByBrand = async(brandID) => {

    const { rows } = await db.query(`
    SELECT count(*) FROM ${tableName}
    WHERE "brand_id" = '${brandID}'
    `)
    return rows[0].count;
}

exports.getShoeByName = async(name) => {
    const { rows } = await db.query(`
    SELECT * FROM SHOES 
    WHERE "state"='true' 
    AND "shoes_name" ='${name}'`);

    return rows;
}

const totalItems = async(search, brand, price) => {

    const { rows } = await db.query(`
        SELECT count(*) FROM ${tableName} 
        WHERE "state" = 'true'
        AND "shoes_name" like '%${search}%'
        ${brand ? brand: ""}
        ${price ? price:""}
    `);

    return rows[0].count;
}


exports.getAllProducts = async({ page, per_page = 10, search = "", brand = "", price = "", filter = "" }) => {

    const offset = (page - 1) * per_page;
    const { rows } = await db.query(`
    SELECT * FROM ${tableName} 
    WHERE "state" = 'true'
    AND "shoes_name" like '%${search}%'
    ${brand ? brand: ""}
    ${price ? price:""}
    ${filter ? filter:""}
    LIMIT ${per_page} OFFSET ${offset}`);

    const total_items = await totalItems(search, brand, price, filter);
    const total_page = total_items % per_page === 0 ? (total_items / per_page) : Math.floor(total_items / per_page) + 1;

    return { items: rows, total_page };
}
exports.priceForShow = function(price) {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}
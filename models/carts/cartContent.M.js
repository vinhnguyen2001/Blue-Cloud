const db = require('../db');
const cartContent = "public.cart_content";
const shoesTable = "public.shoes";


// Thêm sản phẩm vào trong giỏ hàng
exports.ItemAddToCard = async({ card_id, shoe_id, size, quantity }) => {
    // console.log(card_id, shoe_id, size, quantity);
    let isExist = await db.query(`
    SELECT * FROM ${cartContent}
    WHERE "cart_id" = '${card_id}' AND "shoes_id" = '${shoe_id}'
    AND "cart_size" = '${size}'
    `);


    if (isExist.rowCount == 0) {
        let { rows } = await db.query(`INSERT INTO ${cartContent}
        ("cart_id", "shoes_id","cart_size", "cart_quantity")
        values (${card_id}, ${shoe_id},${size}, ${quantity})
        RETURNING *`);

        return rows;
    }

    let newQuantity = parseInt(isExist.rows[0].cart_quantity) + parseInt(quantity);
    let { rows } = await db.query(`
    UPDATE ${cartContent}
    SET "cart_quantity" = '${newQuantity}'
    WHERE "cart_id" = '${card_id}' AND "shoes_id" = '${shoe_id}'  AND "cart_size" = '${size}'
    RETURNING *`);

    return rows;
}

// Lấy thông tin sản phẩm có trong card.

exports.getCartContent = async(c_id) => {
    const { rows } = await db.query(`
    SELECT * FROM ${cartContent} CC JOIN ${shoesTable} S
    ON CC.shoes_id = S.shoes_id
    WHERE CC.cart_id = '${c_id}'
    ORDER BY cart_content_id DESC`);
    return rows;
}

exports.updateCartContent = async(strQuery) => {

    const { rows } = await db.query(`${strQuery}`);

    return rows;

}

exports.deleteAllFromCart = async(cart_id) => {
    const { rows } = await db.query(`DELETE FROM ${cartContent} WHERE "cart_id" = '${cart_id}'
    RETURNING *`);
    return rows;
}
exports.removeOneFromCart = async(content_id) => {

    // Xóa giày khỏi giỏ
    let deletedRow = await db.query(`delete from cart_content where cart_content_id = ${content_id};`)

    return deletedRow;
};

exports.getCrrCartPrice = async(c_id) => {
    let sumPrice = (await db.query(`select sum(cc.cart_quantity*s.price) as price
    from cart_content cc inner join shoes s
    on cc.shoes_id = s.shoes_id
    where cart_id = ${c_id};`)).rows[0].price;
    return sumPrice;
};
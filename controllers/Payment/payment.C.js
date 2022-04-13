const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../../models/user/user.M');

const { priceForShow, reduceStockShoe } = require("../../models/shoes/shoe.M");
const { getCartContent, updateCartContent, deleteAllFromCart, getCrrCartPrice } = require('../../models/carts/cartContent.M');
const { getCartId } = require('../../models/carts/carts.M');
const { addRow } = require('../../models/order/order.M');
const { addRowOrContent } = require('../../models/order/orderContent.M');

var username = "user01";
var role = "0";
var idUser = '1';
const getToken = (req, res) => {
    const access_token = req.cookies.jwt;

    if (access_token) {
        const token = access_token.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

            username = data.username;
            idUser = data.id;

            return username;
        });
    } else {
        res.redirect('/dangnhap');
    }

}

router.get("/thongtin", async(req, res) => {

    const { error } = req.query;
    getToken(req, res);
    let u_id = idUser;
    let user = await getUserById(u_id);
    let c_id = await getCartId(u_id);
    let c_content = await getCartContent(c_id);

    if (c_content.length == 0) {
        return res.redirect('/giohang');
    }

    let c_price = await getCrrCartPrice(c_id);


    if (!c_price) {
        c_price = 0;
    }

    //Hiển thị giá
    for (let content of c_content) {
        content.price = priceForShow(content.price);
        content.image = content.image[0];
    }
    c_price = priceForShow(c_price);


    res.render('payment/payment', {
        User: user,
        title: "Thông tin giao hàng",
        cssP: () => 'Payment/cssPayment',
        scriptsP: () => 'Payment/scriptPayment',
        Contents: c_content,
        sumPrice: c_price,
        image: c_content.image,
        error,
    });
});

//[POST] thanhtoan/thongtin
router.post("/thongtin", async(req, res) => {
    const { fullname, email, phone, address, province, district, ward } = req.body;
    const contentOfCart = await getCartContent(idUser);
    var strQuery = ``;

    let cart_id = await getCartId(idUser);

    if (fullname == "") {
        return res.redirect('/thanhtoan/thongtin?error=003');
    }
    if (phone === "" || phone[0] != '0' || phone.length != 10) {
        return res.redirect('/thanhtoan/thongtin?error=002');
    }
    if (province === 'Rỗng' || address.length == 0) {
        return res.redirect('/thanhtoan/thongtin?error=001');
    }

    const fullAddress = `${address} ${ward} ${district} ${province}`;

    let total = await getCrrCartPrice(cart_id);
    if (!total) {
        total = 0;
    }
    const newRow = await addRow(idUser, total, phone, fullAddress, 0);
    const order_id = newRow[0].order_id;
    for (elm of contentOfCart) {
        strQuery += `(${order_id},${elm.shoes_id},${elm.cart_size},${elm.price},${elm.cart_quantity}),`;
    }
    strQuery = strQuery.slice(0, strQuery.length - 1);

    const newRowcontent = await addRowOrContent(strQuery);

    const delRow = await deleteAllFromCart(cart_id);

    const newRowinShoe = await reduceStockShoe(newRow[0].order_id);


    if (newRowcontent.length > 0 && delRow.length > 0 && newRow.length > 0) {
        res.redirect('/');
    } else {
        res.redirect('/thanhtoan/thongtin?error=004');
    }
});
module.exports = router;
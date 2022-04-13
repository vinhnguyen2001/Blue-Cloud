const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUserById } = require('../../models/user/user.M');
const { getCartContent, updateCartContent, deleteAllFromCart, getCrrCartPrice } = require('../../models/carts/cartContent.M');
const { getCartId } = require('../../models/carts/carts.M');
const { priceForShow } = require("../../models/shoes/shoe.M");
const { convertDate } = require('../../helper/dateTime.H')
const { getAllUserOrder, getOneUserOrder, getUserOrderContent } = require("../../models/order/order.M")

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

// Xem hóa đơn
router.get('/', async(req, res) => {
    getToken(req, res);

    let user = await getUserById(idUser);
    let ods = await getAllUserOrder(idUser);

    // Thay đổi thông tin để hiển thị
    for (let od of ods) {

        od.total = priceForShow(od.total);
        od.order_time = convertDate(od.order_time);

        if (od.status == 0) {
            od.status = "Chưa thanh toán"
        } else if (od.status == 1) {
            od.status = "Đã thanh toán"
        } else {
            od.status = "Đã hủy"
        }
    }

    res.render('order/order', {
        title: "Hóa đơn",
        cssP: () => 'Order/cssOrder',
        scriptsP: () => 'empty',
        User: user,
        Orders: ods,
    })
});


// Xem thông tin hóa đơn
router.get('/:id/detail', async(req, res) => {


    let order_id = req.params.id;

    let od = await getOneUserOrder(order_id);
    let ord_content = await getUserOrderContent(order_id);
    // Thay đổi thông tin để hiển thị
    for (let content of ord_content) {
        content.price = content.price * content.quantity;
        content.price = priceForShow(content.price);
        content.image = content.image[0];
    }
    od.total = priceForShow(od.total);
    res.render('order/orderDetail', {
        title: `Thông tin hóa đơn #${order_id}`,
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        Order: od,
        items: ord_content,
        sumPrice: od.total,
        ID_Order: order_id,
    })
});

module.exports = router;
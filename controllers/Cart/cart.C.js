const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    getUserById
} = require('../../models/user/user.M');

const { priceForShow } = require("../../models/shoes/shoe.M");
const { getCartContent, updateCartContent, removeOneFromCart, getCrrCartPrice } = require('../../models/carts/cartContent.M');
const { getCartId } = require('../../models/carts/carts.M');


var username = "user01";
var role = "0";
var idUser = '1';

// Xác định vị trí của phần tử
const indexOfSize = (sizes, value) => {
    let i = 0;
    for (; i < sizes.length; i++) {

        if (sizes[i] == value) {
            break;
        }
    }
    return i;
};

// GET USER-ID
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


//[GET] /giohang
router.get("/", async(req, res) => {

    getToken(req, res);
    let u_id = idUser;

    //let u_id = req.params.user_id;
    let user = await getUserById(u_id);
    let cart_id = await getCartId(u_id);

    let items = await getCartContent(cart_id);
    let totalPrice = await getCrrCartPrice(cart_id);

    for (let item of items) {
        item["shoe_stock"] = item.stock[indexOfSize(item.size, item.cart_size)];
    }

    if (!totalPrice) {
        totalPrice = 0;
    }
    //Hiển thị giá

    for (let item of items) {
        item["prePrice"] = item.price;
        item.price = item.price * parseInt(item.cart_quantity);
        item.price = priceForShow(item.price);
        item.image = item.image[0];

    }
    totalPrice = priceForShow(totalPrice);


    res.render('cart/cart', {
        title: "Giỏ hàng",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        Cart_id: cart_id,
        User: user,
        Contents: items,
        sumPrice: totalPrice,
        image: items.image,
    });
});

// [POST] /giohang
router.post("/", async(req, res) => {

    const { id, quantity } = req.body;

    var strQuery = ``;
    for (let i = 0; i < id.length; i++) {

        let fistValue = quantity[i];
        let secondValue = id[i];
        strQuery += `
        UPDATE public.cart_content
        SET cart_quantity= ${fistValue}
        WHERE cart_content_id=${secondValue};

        `;
    }
    const data = await updateCartContent(strQuery);

    res.status(200).send({ status: "success" });

});

// [DELETE] giohang/:shoesid/
router.delete('/:idContent/', async(req, res) => {
    getToken(req, res);
    const idContent = req.params.idContent;
    let u_id = idUser;


    let deletedRow = await removeOneFromCart(idContent);
    res.redirect('back');
});


module.exports = router;
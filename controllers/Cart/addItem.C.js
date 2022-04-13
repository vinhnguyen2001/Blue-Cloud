const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { ItemAddToCard } = require('../../models/carts/cartContent.M')
const { getCartId } = require('../../models/carts/carts.M')

var username = "user01";
var role = "0";
var idUser = '1';

// GET ID-USER
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

// [POST] /add-item
router.post("/", async(req, res) => {
    const { size, id, quantity = 1 } = req.body;
    getToken(req, res);
    const card_id = await getCartId(idUser);

    const newRow = await ItemAddToCard({ card_id, shoe_id: id, size: size, quantity: quantity });


    if (newRow.length > 0) {

        res.status(200).send({ status: "success" });
    }

})

module.exports = router;
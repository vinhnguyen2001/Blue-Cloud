const express = require("express");
// const { priceForShow } = require("../../models/shoes/shoe.M");
// const { getShoesByName } = require("../../models/user/shoes");
// const { getShoesById } = require("../../models/shoes/shoe.M")
const jwt = require('jsonwebtoken');
const router = express.Router();
var username = "user01";
var role = "0";
var idUser = 0;

const getToken = (req, res) => {
    const access_token = req.cookies.jwt;

    if (access_token) {
        const token = access_token.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
            idUser = data.id;
            role = data.role;
            return username;
        });
    }

};

// [GET] /  === trang chủ quản lí===
router.get("/", async(req, res) => {
    const username = getToken(req, res);
    res.render('owner', {
        cssP: () => 'OwnerHome/cssHome',
        scriptsP: () => 'empty',
        title: 'Trang chủ quản lí',
    });
});

module.exports = router;
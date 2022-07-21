const express = require("express");
// const { priceForShow } = require("../../models/shoes/shoe.M");
// const { getShoesByName } = require("../../models/user/shoes");
// const { getShoesById } = require("../../models/shoes/shoe.M")
const jwt = require('jsonwebtoken');
const router = express.Router();
var username = "user01";
var role = "0";
var idUser = 0;

// [GET] /  === trang chủ quản lí===
router.get("/", async(req, res) => {

    res.render('owner', {
        cssP: () => 'OwnerHome/cssHome',
        scriptsP: () => 'empty',
        title: 'Trang chủ quản lí',
    });
});

module.exports = router;
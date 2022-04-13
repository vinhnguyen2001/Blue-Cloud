const express = require("express");
const { getShoesById, getShoesByName, priceForShow } = require("../../models/shoes/shoe.M");
const { getQuantityByUserId } = require('../../models/carts/carts.M');

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

// [GET] /  === trang chủ ===
router.get("/", async(req, res) => {
    const username = getToken(req, res);

    let pdsNike = await getShoesById(1, 2, 3, 4, 5, 1);
    let pdsAdidas = await getShoesById(43, 12, 13, 14, 15, 2);
    let pdsBitis = await getShoesById(26, 29, 30, 28, 41, 3);

    for (let i = 0; i < 5; i++) {
        pdsNike[i].price = priceForShow(pdsNike[i].price);
        pdsAdidas[i].price = priceForShow(pdsAdidas[i].price);
        pdsBitis[i].price = priceForShow(pdsBitis[i].price);
        pdsNike[i].image = pdsNike[i].image[0];
        pdsAdidas[i].image = pdsAdidas[i].image[0];
        pdsBitis[i].image = pdsBitis[i].image[0];


    }

    res.render('home', {
        cssP: () => 'Homepage/css',
        scriptsP: () => 'Homepage/script',
        PackagesNike: pdsNike,
        PackagesAdidas: pdsAdidas,
        PackagesBitis: pdsBitis,
        title: 'Trang chủ | Blue Cloud',
    });
});

// [GET] /search
router.get("/search", async(req, res) => {

    var { page = 1, search = "" } = req.query;
    // console.log(search);
    search = search.trim();
    var prevSearch = search;
    search = search.toLowerCase();
    var queryStrSize = ` `;
    var queryStrPrice = ` `;
    const { items } = await getShoesByName({ page, search, price: queryStrPrice, sizes: queryStrSize });


    var flag = 0;
    for (elm of items) {
        flag = 1;
        elm.price = priceForShow(elm.price);
        elm.image = elm.image[0];
    }
    res.render('search/search', {

        cssP: () => 'Search/cssSearch',
        scriptsP: () => 'Search/scriptSearch',
        title: ` Tìm kiếm ${prevSearch} | Blue Cloud`,
        Packages: items,
        search: prevSearch,
        flag,
    });
});

// [POST] /search
router.post("/search", async(req, res) => {
        var { search, arrSizes, price, page = 1 } = req.body;
        var queryStrSize = ``;
        var queryStrPrice = ``;
        var flag = false;

        if (arrSizes) {
            for (elm of arrSizes) {
                flag = true;
                queryStrSize += `'${elm}' = ANY("size") OR`
            }
            queryStrSize = queryStrSize.slice(0, queryStrSize.length - 2);
        }
        if (flag == true) {
            queryStrSize = `AND (${queryStrSize})`;
        }

        if (price != "") {
            queryStrPrice = `AND "price" between '0' AND  '${price*1000}'`;
        }

        const { items } = await getShoesByName({ page, search, price: queryStrPrice, sizes: queryStrSize });

        if (items.length > 0) {
            for (elm of items) {
                elm.price = priceForShow(elm.price);
                elm.image = elm.image[0];
            }
        }
        res.status(200).json({ items });

    })
    // Số lượng của trong cart
router.post("/count", async(req, res) => {
    let quantity = await getQuantityByUserId(idUser);

    if (0 <= parseInt(quantity[0].count)) {
        // console.log("Quantity: ", quantity[0].count)
        res.status(200).json({ status: "success", amount: quantity[0].count });
    } else {
        res.status(200).json({ status: "error" });

    }

})
module.exports = router;
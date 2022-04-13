const express = require("express");
const { priceForShow } = require("../../models/shoes/shoe.M");

const { getShoesInBrand } = require("../../models/shoes/shoe.M");
const router = express.Router();

var value = [1, 2, 3];
var flag = false;

// [GET] /adidas
router.get("/", async(req, res) => {


    let { page = 1 } = req.query;
    // Trang adidas

    let { total_page, items } = await getShoesInBrand({ page: page, brandID: 2 });

    page = parseInt(page);
    if (page < 1) {
        page = 1;
    }
    total_page = parseInt(total_page);


    if (page > value[2]) {

        if (page <= total_page - 2) {
            value.push(page, page + 1, page + 2);
            value.splice(0, 3);
        } else if (page <= total_page - 1) {
            value.push(page, page + 1);
            value.splice(0, 2);
        } else if (page == total_page) {
            value.push(page);
            value.splice(0, 1);
        }
    } else if (page < value[0]) {

        if (3 <= page) {
            value.push(page - 2, page - 1, page);
            value.splice(0, 3);
        } else if (2 <= page) {
            value.push(page - 1, page, page + 1);
            value.splice(0, 3);
        } else if (1 == page) {
            value.push(page, page + 1, page + 2);
            value.splice(0, 3);
        }
    }
    let prePage = value[0] - 1,
        nextPage = value[2] + 1;


    if (value.length > 3) {
        value.splice(0, 3);
    }

    if (parseInt(total_page) < parseInt(nextPage)) {
        nextPage = page;
    }
    if (parseInt(page) <= 3) {
        prePage = 1;
    }


    for (let item of items) {
        item.price = priceForShow(item.price);
        item.image = item.image[0];
    }

    res.render('Brandpage/adidasPage', {
        title: 'Giày - Adidas | Blue Cloud',
        cssP: () => 'Adidas/cssAdidasPage',
        scriptsP: () => 'Adidas/scriptAdidasPage',
        Packages: items,
        total_page,
        prePage,
        nextPage,
        value,
        page,
        length: items.length,
    });
});


module.exports = router;
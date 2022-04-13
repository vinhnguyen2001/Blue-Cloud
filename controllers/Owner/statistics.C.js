const express = require("express");
const res = require("express/lib/response");
const router = express.Router();

const { countShoeSoldByMonthAndBrand, countShoeSoldByMonth, countTotalShoes, countTotalPriceByMonth } = require("../../models/order/orderContent.M")

//[GET] statistics
router.get("/", async(req, res) => {

    const { month = 1 } = req.query;
    var nikeShoeMonth = await countShoeSoldByMonthAndBrand(month, 1);
    var adidasShoeMonth = await countShoeSoldByMonthAndBrand(month, 2);
    var bitisShoeMonth = await countShoeSoldByMonthAndBrand(month, 3);

    var shoebyMonth = [];
    var revenue = [];
    for (let i = 1; i <= 12; i++) {
        let dummy = await countShoeSoldByMonth(i);
        let dummyPrice = await countTotalPriceByMonth(i);
        if (dummy == null) {
            dummy = 0;
        }
        if (dummyPrice == null) {
            dummyPrice = 0;
        }
        shoebyMonth.push(dummy);
        revenue.push(dummyPrice)
    }


    var totalShoes = [];
    for (let i = 1; i < 4; i++) {
        let dummy = await await countTotalShoes(i);
        if (dummy == null) {
            dummy = 0;
        }
        totalShoes.push(dummy);
    }

    if (nikeShoeMonth == null) {
        nikeShoeMonth = 0;
    }
    if (adidasShoeMonth == null) {
        adidasShoeMonth = 0;
    }
    if (bitisShoeMonth == null) {
        bitisShoeMonth = 0;
    }
    var amountPMBrand = [];
    amountPMBrand.push(nikeShoeMonth, adidasShoeMonth, bitisShoeMonth);

    res.render("Owner/Statistic/statistic", {
        title: "Thống kê sản phẩm & doanh thu| Blue Cloud",
        cssP: () => 'Statistic/css',
        scriptsP: () => 'Statistic/script',
        month: month,
        monthlysales: JSON.stringify(amountPMBrand),
        revenue: JSON.stringify(revenue),
        percentShoes: JSON.stringify(totalShoes),
        totalShoes: JSON.stringify(shoebyMonth)
    });
})




module.exports = router;
const express = require("express");
const { getShoes, priceForShow } = require("../../models/shoes/shoe.M");
const router = express.Router();


function ucwords(str, force) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g, function(firstLetter) {
        return firstLetter.toUpperCase();
    });
};
//[GET] shoes/:id/detail
router.get("/:id/detail", async(req, res) => {
    try {
        let shoesId = req.params.id;
        let pd = await getShoes(shoesId);
        if (pd.state == false) {
            return res.redirect("/error");

        }
        pd.price = priceForShow(pd.price);
        let data = { sizeArr: pd.size, stockArr: pd.stock };
        let Brand;

        if (pd.brand_id == 1) {
            Brand = "Nike"
        } else if (pd.brand_id == 2) {
            Brand = "Adidas"
        } else {
            Brand = "Bitis"
        }
        // res.json(data);

        pd.shoes_name = ucwords(pd.shoes_name, true);
        res.render('Brandpage/shoesPage', {
            title: `Chi tiết - ${pd.shoes_name}`,
            cssP: () => 'Detail/cssShoes',
            scriptsP: () => 'empty',
            Shoes: pd,
            brand: Brand,
            first: pd.image[0],
            data: data,
        })
    } catch (err) {
        console.error("error for detail shoe", err);
        res.redirect("*");
    }
});

module.exports = router;
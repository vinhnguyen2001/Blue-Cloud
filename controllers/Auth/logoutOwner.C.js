const express = require("express");
const router = express.Router();

//[GET] /dangxuat
router.get('/', (req, res) => {
    res.cookie('admintoken', '', { maxAge: 0.01 });
    res.redirect('/dangnhap');
});

module.exports = router;
const express = require("express");
const router = express.Router();

//[GET] /dangxuat
router.get('/', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/dangnhap');
});

module.exports = router;
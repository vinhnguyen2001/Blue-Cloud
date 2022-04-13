const express = require("express");
const { getAll, getOne, addOne } = require('../../models/auth/auth.M');
const { addOneCarts } = require('../../models/carts/carts.M');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();

//[GET] /dangki
router.get("/", (req, res) => {
    res.render('account/logUp', {
        title: () => 'Đăng kí',
        cssP: () => 'Auth/auth',
        scriptsP: () => 'Auth/scriptLogup',

    });
});

// Hàm xử lí lỗi
handleError = (e) => {

    errs = { userErr: '', nameErr: '', phoneErr: '', passErr: '' };

    // phần lỗi tên đăng nhập
    if (e.message == 'Tên đăng nhập không được để trống') {
        errs.userErr = 'Tên đăng nhập không được để trống';
        return errs;
    }
    if (e.message == 'Tên đăng nhập dài hơn 20 kí tự') {
        errs.userErr = 'Tên đăng nhập dài hơn 20 kí tự';
        return errs;
    }
    if (e.message == 'Kí tự đầu tên đăng nhập không bắt đầu từ kí số') {
        errs.userErr = 'Kí tự đầu tên đăng nhập không bắt đầu từ kí số';
        return errs;
    }
    if (e.message == 'Tên đăng nhập không chứa khoảng trắng') {
        errs.userErr = 'Tên đăng nhập không chứa khoảng trắng';
        return errs;
    }
    if (e.message == 'Tên đăng nhập này đã tồn tại') {
        errs.userErr = 'Tên đăng nhập này đã tồn tại';
        return errs;
    }

    // phần lỗi họ tên
    if (e.message == 'Họ tên không được để trống') {
        errs.nameErr = 'Họ tên không được để trống';
        return errs;
    }
    if (e.message == 'Họ tên phải viết hoa chữ đầu') {
        errs.nameErr = 'Họ tên phải viết hoa chữ đầu';
        return errs;
    }

    // phần lỗi cho số điện thoại
    if (e.message == 'Số điện thoại không được để trống') {
        errs.phoneErr = 'Số điện thoại không được để trống';
        return errs;
    }
    if (e.message == 'Chữ số đầu tiên phải là số 0') {
        errs.phoneErr = 'Chữ số đầu tiên phải là số 0';
        return errs;
    }
    if (e.message == 'Số điện thoại nhiều hơn 10 số') {
        errs.phoneErr = 'Số điện thoại nhiều hơn 10 số';
        return errs;
    }
    if (e.message == 'Số điện thoại ít hơn 10 số') {
        errs.phoneErr = 'Số điện thoại ít hơn 10 số';
        return errs;
    }

    // phần lỗi password
    if (e.message == 'Mật khẩu không được để trống') {
        errs.passErr = 'Mật khẩu không được để trống';
        return errs;
    }
}
const createJWToken = (id, name, role) => {
    // thêm id_user và role_id vào trong token
    const data = {
        id: id,
        username: name,
        role: role,
    };
    return jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '24h',
    });
};

//[POST] /dangki
router.post("/", async(req, res) => {

    const { uservalue, fullnamevalue, phonevalue, passvalue, errs } = req.body;
    try {

        if (uservalue === '') {
            throw Error("Tên đăng nhập không được để trống");
        }
        if (uservalue.length > 20) {
            throw Error("Tên đăng nhập dài hơn 20 kí tự");
        }
        if (errs.userErr != '') {
            throw Error(errs.userErr);
        }
        if (passvalue === '') {
            throw Error("Mật khẩu không được để trống");
        }
        if (errs.phoneErr != '') {
            throw Error(errs.phoneErr);
        }
        if (errs.nameErr != '') {
            throw Error(errs.nameErr);
        }
        // Kiểm tra tài khoản user đã tồn tại trong db hay Chưa
        const dataUser = await getOne('username', uservalue);
        if (dataUser.length != 0) {
            throw Error('Tên đăng nhập này đã tồn tại');
        }
        // hash password
        const salt = await bcrypt.genSalt(); // Thêm muối
        const pwdHashed = await bcrypt.hash(passvalue, salt);

        //lưu vào database table user
        const newUser = await addOne(uservalue, fullnamevalue, phonevalue, pwdHashed);
        // // lưu vào trong database table carts


        const newCart = await addOneCarts(newUser[0].user_id);

        //tạo token cho client
        const token = createJWToken(newUser[0].user_id, newUser[0].username, newUser[0].role_id);
        const access_token = `Beaer ${token}`;
        res.cookie('jwt', access_token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ status: 'success' });
        res.redirect('/');


    } catch (e) {
        const errs = handleError(e);
        res.status(400).json(errs);
    }
});

module.exports = router;
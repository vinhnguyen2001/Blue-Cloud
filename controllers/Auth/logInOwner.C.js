const express = require("express");
const router = express.Router();
const { getAll, getOne, addOne } = require('../../models/auth/auth.M');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// [GET] /dangnhap
router.get("/", (req, res) => {
    res.render('account/logIn', {
        title: 'Đăng nhập',
        cssP: () => 'Auth/auth',
        scriptsP: () => 'Auth/scriptLogin',

    });
});

// Hàm xử lí lỗi
const handleError = (e) => {

    errs = { userErr: '', passErr: '' };

    // phần lỗi tên đăng nhập
    if (e.message == 'Tên đăng nhập không được để trống') {
        errs.userErr = 'Tên đăng nhập không được để trống';
        return errs;
    }
    if (e.message == 'Không có quyền truy cập') {
        errs.userErr = 'Không có quyền truy cập';
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
    if (e.message == 'Tên đăng nhập không tồn tại') {
        errs.userErr = 'Tên đăng nhập không tồn tại';
        return errs;
    }

    // phần lỗi password
    if (e.message == 'Mật khẩu không được để trống') {
        errs.passErr = 'Mật khẩu không được để trống';
        return errs;
    }
    if (e.message == 'Mật không không chính xác') {
        errs.passErr = 'Mật không không chính xác';
        return errs;
    }

}

// Tạo token - JWT
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
}

// [POST] /dangnhap
router.post('/', async(req, res) => {

    const { uservalue, passvalue, errs } = req.body;
    try {

        if (uservalue === '') {
            throw Error("Tên đăng nhập không được để trống");
        }
        if (errs.userErr != '') {
            throw Error(errs.userErr);
        }
        if (passvalue === '') {
            throw Error("Mật khẩu không được để trống");
        }
        // Kiểm tra tài khoản user đã tồn tại trong db hay chưa
        const dataUser = await getOne('username', uservalue);
        //console.log("userdata:", dataUser);
        if (dataUser.length == 0) {
            throw Error("Tên đăng nhập không tồn tại");
        } else if (dataUser[0].role_id != 1) {
            throw Error("Không có quyền truy cập");
        } else {
            //kiểm tra password 
            const isPwd = await bcrypt.compare(passvalue, dataUser[0].pwd);

            if (!isPwd) {
                throw Error("Mật không không chính xác");
            }

        }

        //tạo token cho client
        const token = createJWToken(dataUser[0].user_id, dataUser[0].username, dataUser[0].role_id);
        const localUser = {
            id: dataUser[0].user_id,
            username: dataUser[0].username,
            role: dataUser[0].role_id,
        };

        // Lưu trữ token ở cookie
        const access_token = `Beaer ${token}`;
        res.cookie('admintoken', access_token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ status: 'success', role: dataUser[0].role_id });

    } catch (e) {
        const errs = handleError(e);
        res.status(400).json(errs);
    }
});
module.exports = router;
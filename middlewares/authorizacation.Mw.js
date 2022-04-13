const jwt = require('jsonwebtoken');
const { getAll, getOne, addOne } = require('../models/auth/auth.M');
const { getUserById } = require('../models/user/user.M');
const { getCartContent } = require('../models/carts/cartContent.M');
const { getQuantityByUserId } = require('../models/carts/carts.M');

const authenTokenResApi = (req, res, next) => {

    const access_token = req.cookies.jwt;

    if (typeof access_token == 'undefined') {
        res.status(401).send({ status: "no-access-token" });
    } else {
        next();
    }

}
const authenToken = (req, res, next) => {
    const access_token = req.cookies.jwt;
    // access_token có dạng  `Beaer [token]`
    if (typeof access_token == 'undefined') {
        // unauthorized
        res.redirect('/dangnhap');
    } else {
        const token = access_token.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {

            if (err) {
                res.status(401).send(
                    `<style>
            h1{
                text-align:center;
            }
            a{
                display:block;
                text-align:center;
            }
            button{
            border:none;
            border-radius:15px;
            background-color:#176fd3;
            padding: 1rem 2rem;
            color:white;
            font-size:1.8rem;
            }
            </style>
            <h1> Phiên hết hạn. Hãy đăng nhập lại </h1>
            <a href ="/dangnhap">
            <button> Đăng nhập </button>
            </a>`)
                res.locals.user = null;
            }
            res.locals.user = data;
        });

        next();
    };


}


const checkUserIsLogin = (req, res, next) => {

    const access_token = req.cookies.jwt;
    if (!access_token) {
        next();
    } else if (access_token) {
        // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
        //     if (err) {
        //         res.clearCookie("jwt");
        //     }

        // });

        res.redirect('/');
    }
};
const checkUserIsLoginAdmin = (req, res, next) => {

    const access_token = req.cookies.jwt;
    if (!access_token) {
        next();
    } else if (access_token) {

        const token = access_token.split(' ')[1];
        if (!token) {
            res.clearCookie("jwt");
            return res.redirect('/');

        }

        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    throw Error(err);
                }

                if (decoded.role != 1) {
                    throw Error(err);

                }
            });
        } catch (err) {
            res.clearCookie("jwt");
            return res.redirect('/');
        }


        return res.redirect('/home');
    }
};


const checkCurrentUser = (req, res, next) => {
    const access_token = req.cookies.jwt;
    if (!access_token) {
        next();
    } else {
        const token = access_token.split(' ')[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async(err, data) => {

            // let quantity = await getQuantityByUserId(data.id);
            res.locals.user = data;
            // res.locals.cart_quantity = quantity[0].count;
        });
        next();
    }
}



const checkAuthAdmin = (req, res, next) => {

    const access_token = req.cookies.jwt;
    if (!access_token) {
        res.redirect('/dangnhap');
    } else {

        const token = access_token.split(' ')[1];

        if (!token) {
            res.clearCookie("jwt");
            return res.redirect('/');
        }
        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    throw new Error(err);
                }
                if (decoded.role != 1) {
                    throw Error(err);

                }
                res.locals.user = decoded;

            });
        } catch (err) {
            res.clearCookie("jwt");
            return res.redirect('/');
        }
        next();
    }

};

module.exports = { authenToken, checkUserIsLogin, checkCurrentUser, authenTokenResApi, checkAuthAdmin, checkUserIsLoginAdmin };
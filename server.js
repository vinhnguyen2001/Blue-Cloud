const express = require("express");
const app = express();
const port = 3000;
const exhbs = require("express-handlebars");
const methodOverride = require('method-override');


// import cookie-parse
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// Chuyển method
app.use(methodOverride('_method'));

// import dotenv - bien moi truong
require('dotenv').config();

// import authenToken 
const { authenToken, checkUserIsLogin, checkCurrentUser, authenTokenResApi } = require('./middlewares/authorizacation.Mw')

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public thư mục ra ngoài
app.use(express.static(__dirname + '/public'));


// doi ten
var hbs = exhbs.create({
    defaultLayout: "main",
    extname: "hbs",
    helpers: {
        // so sanh chuoi
        compareString(s1, s2, options) {
            return s1 === s2 ? options.fn(this) : options.inverse(this);
        },
        // so sanh hai so
        compareInt(int1, int2, options) {
            return +int1 === +int2 ? options.fn(this) : options.inverse(this);
        },
        compareInt2(int1, int2, options) {
            return +int1 != +int2 ? options.fn(this) : options.inverse(this);
        },
        forN(n, block) {
            let acum = "";
            for (let i = 1; i <= n; i++) {
                acum += block.fn(i);
            }
            return acum;
        },
    }
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');



// TẤT CẢ CÁC ROUTE

// Route - Trang chủ
app.use('/', checkCurrentUser, require("./controllers/Site/home.C"));
// Route - Đăng nhập
app.use('/dangnhap', checkUserIsLogin, require("./controllers/Auth/logIn.C"));
// Route - Đăng k
app.use('/dangki', checkUserIsLogin, require("./controllers/Auth/logUp.C"));
// app.use('*', authenToken);

// Route - Trang chi tiết giày
app.use('/shoes', checkCurrentUser, require("./controllers/Detail/shoes.C"));

// Route - Trang addas
app.use('/adidas', require("./controllers/BrandPage/adidas.C"));
// Route - Trang Nike
app.use('/nike', require("./controllers/BrandPage/nike.C"));
// Route - Trang Bitis
app.use('/bitis', require("./controllers/BrandPage/bitis.C"));
// Route - Đăng xuất
app.use('/dangxuat', require("./controllers/Auth/logOut.C"));
// Route - Đơn hàng
app.use('/donhang', authenToken, require("./controllers/Order/order.C"));
// Route - Trang giỏ hàng
app.use('/giohang', authenToken, require("./controllers/Cart/cart.C"));
// Route  - Xử lí thêm vào giỏ hàng
app.use('/add-item', authenTokenResApi, require("./controllers/Cart/addItem.C"));
// route - Trang thanh toán
app.use('/thanhtoan', authenToken, require("./controllers/Payment/payment.C"));


//Route - Tất cả các trang còn lại
app.use('*', require("./controllers/Site/whoop.C"));

app.listen(port, () => {
    console.log(`Listen in port http://localhost:${port}`);
});
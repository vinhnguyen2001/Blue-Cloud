const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const { convertDate } = require('../../helper/dateTime.H')
const { getAllUserOrder, getOneUserOrder, getUserOrderContent } = require("../../models/order/order.M");
const { getOrders, priceForShow, cancelOrder, updateOrder } = require("../../models/owner/orders.M.js");

// Xem hóa đơn
router.get('/', async(req, res) => {

    var { del, update, page = 1, search = "", update } = req.query;

    search = search.trim();

    let { items, total_page } = await getOrders({ page, search });

    if (items.length == 0) {
        res.render('Owner/Order/orderOwner', {
            title: "Tất cả hóa đơn | Blue Cloud",
            cssP: () => 'OwnerOrder/cssOrder',
            scriptsP: () => 'OwnerOrder/scriptOrder',
            items,
            page: page,
            total_page,
            search,
            del,
            update,
            notFound: 1,
        })
    }


    // Thay đổi thông tin để hiển thị
    for (let item of items) {

        item.total = priceForShow(item.total);
        item.order_time = convertDate(item.order_time);

        if (item.status == 0) {
            item.status = "Chưa thanh toán"
        } else if (item.status == 1) {
            item.status = "Đã thanh toán"
        } else {
            item.status = "Đã hủy"
        }
    }

    res.render('Owner/Order/orderOwner', {
        title: "Tất cả hóa đơn | Blue Cloud",
        cssP: () => 'OwnerOrder/cssOrder',
        scriptsP: () => 'OwnerOrder/scriptOrder',
        items,
        page: page,
        total_page,
        search,
        del,
        update,
    })
});

// Hủy hóa đơn
router.delete('/:o_id', async(req, res) => {
    let o_id = req.params.o_id;

    const { page, search } = req.query;

    try {
        let cancelRow = await cancelOrder(o_id);
        res.redirect(`/allorders?page=${page}&search=${search}&del=success`);
    } catch (err) {
        console.error("error for delete order item: ", err);
        res.redirect(`/allorders?page=${page}&search=${search}&del=error`);

    }
});

//Sửa hóa đơn
router.put('/:o_id', async(req, res) => {
    let o_id = req.params.o_id;
    let o_phone = req.body.o_phone;
    let o_address = req.body.o_address;
    let o_status = req.body.o_status;
    let { page = 1, search } = req.query;
    // Sửa bảng
    try {
        let updatedRow = await updateOrder(o_id, o_phone, o_address, o_status);
        res.redirect(`/allorders?page=${page}&search=${search}&update=success`);

    } catch (err) {
        console.error("error for delete order item: ", err);
        res.redirect(`/allorders?page=${page}&search=${search}&update=error`);
    }
});

// Xem thông tin hóa đơn
router.get('/:id/detail', async(req, res) => {


    let order_id = req.params.id;

    let od = await getOneUserOrder(order_id);
    let ord_content = await getUserOrderContent(order_id);
    // Thay đổi thông tin để hiển thị
    for (let content of ord_content) {
        content.price = content.price * content.quantity;
        content.price = priceForShow(content.price);
        content.image = content.image[0];
    }
    od.total = priceForShow(od.total);

    res.render('order/orderDetail', {
        title: "Thông tin hóa đơn",
        cssP: () => 'Cart/cssCart',
        scriptsP: () => 'Cart/scriptCart',
        Order: od,
        items: ord_content,
        sumPrice: od.total,
        ID_Order: order_id,
    })
});
module.exports = router;
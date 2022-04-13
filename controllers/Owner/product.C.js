const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    priceForShow,
    getShoeByName,
    getShoeByIdOwner,
    updateOneRow
} = require("../../models/owner/products.M.js");
const upload = require("../../middlewares/uploadFile.Mw");
const {
    delOneShoeInCart,
    delOneShoe,
    getBranches,
    addOneShoe,

} = require("../../models/owner/shoes.M");

// text to capitalize
function ucwords(str, force) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g, function(firstLetter) {
        return firstLetter.toUpperCase();
    });
};

const compare = (a, b) => {

    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}


//[GET] /allproduct
router.get("/", async(req, res) => {

    var { del, search, page = 1, brand, price = "", filter } = req.query;
    var preSearch = "";
    let queryStrBrand = '';
    let paramStrBrand = '';
    var queryStrPrice = "";
    var queryStrFilter = "";

    if (search) {
        preSearch = search.trim();
        search = search.toLowerCase().trim();
    }
    if (brand) {

        for (elm of brand) {
            queryStrBrand += `"brand_id" = '${elm}' OR `;
            paramStrBrand += `&brand=${elm}`;
        }

        queryStrBrand = queryStrBrand.slice(0, -3);
        queryStrBrand = `AND (${queryStrBrand})`;
    }


    if (price != "") {
        queryStrPrice = `AND "price" between '0' AND  '${price*1000}'`;
    }

    if (filter != "") {
        if (filter == "shoes_id") {
            queryStrFilter = `ORDER BY "${filter}" DESC`;
        } else if (filter == "shoes_name") {
            queryStrFilter = `ORDER BY "${filter}" DESC`;

        } else if (filter == "price ASC") {
            queryStrFilter = `ORDER BY ${filter}`;

        } else if (filter == "price DESC") {
            queryStrFilter = `ORDER BY ${filter}`;
        }
    }

    let { items, total_page } = await getAllProducts({ page: page, search: search, brand: queryStrBrand, price: queryStrPrice, filter: queryStrFilter });
    const brands = await getBranches();

    if (brand) {
        for (let i = 0; i < brands.length; i++) {
            for (elm of brand) {
                if (brands[i].brand_id == elm) {
                    brands[i]['active'] = "1";
                }
            }
        }
    }

    if (items.length == 0) {
        return res.render('Owner/Product/allProduct', {
            title: 'Tất cả sản phẩm | Blue Cloud',
            cssP: () => 'OwnerProduct/cssProduct',
            scriptsP: () => 'OwnerProduct/scriptProduct',
            notFound: 1,
            brands,
            price,
            page,
            search: preSearch,
            filter,
            brand: paramStrBrand,
            del,
        });
    }

    // Thay đổi thông tin để hiển thị 
    for (let item of items) {
        item.price = priceForShow(item.price);
        item.image = item.image[0];
        if (item.brand_id == 1) {
            item.brand_id = "Nike"
        } else if (item.brand_id == 2) {
            item.brand_id = "Adidas"
        } else {
            item.brand_id = "Bitis"
        }
    }

    res.render('Owner/Product/allProduct', {
        title: 'Tất cả sản phẩm | Blue Cloud',
        cssP: () => 'OwnerProduct/cssProduct',
        scriptsP: () => 'OwnerProduct/scriptProduct',
        Packages: items,
        brands,
        price,
        brand: paramStrBrand,
        page,
        search: preSearch,
        filter,
        total_page,
        del,
    });
});


//[POST] /allproduct
router.post('/', async(req, res) => {


    var { search, page = 1, brand, price = "", filter } = req.body;
    const preSearch = search.trim();
    search = search.toLowerCase().trim();
    let queryStrBrand = '';
    let paramStrBrand = '';

    if (brand) {

        for (elm of brand) {
            queryStrBrand += `"brand_id" = '${elm}' OR `;
            paramStrBrand += `&brand=${elm}`;
        }

        queryStrBrand = queryStrBrand.slice(0, -3);
        queryStrBrand = `AND (${queryStrBrand})`;
    }

    var queryStrPrice = "";
    var queryStrFilter = "";
    if (price != "") {
        queryStrPrice = `AND "price" between '0' AND  '${price*1000}'`;
    }

    if (filter != "") {
        if (filter == "shoes_id") {
            queryStrFilter = `ORDER BY "${filter}" DESC`;
        } else if (filter == "shoes_name") {
            queryStrFilter = `ORDER BY "${filter}" DESC`;

        } else if (filter == "price ASC") {
            queryStrFilter = `ORDER BY ${filter}`;

        } else if (filter == "price DESC") {
            queryStrFilter = `ORDER BY ${filter}`;
        }
    }

    let { items, total_page } = await getAllProducts({ page: page, search: search, brand: queryStrBrand, price: queryStrPrice, filter: queryStrFilter });
    const brands = await getBranches();


    if (brand) {
        for (let i = 0; i < brands.length; i++) {
            for (elm of brand) {
                if (brands[i].brand_id == elm) {
                    brands[i]['active'] = "1";
                }
            }
        }
    }
    if (items.length == 0) {
        return res.render('Owner/Product/allProduct', {
            title: 'Tất cả sản phẩm | Blue Cloud',
            cssP: () => 'OwnerProduct/cssProduct',
            scriptsP: () => 'OwnerProduct/scriptProduct',
            notFound: 1,
            brands,
            brand: paramStrBrand,
            price,
            page,
            search: preSearch,
            filter,
            total_page,
        });
    }

    for (let item of items) {
        item.price = priceForShow(item.price);
        item.image = item.image[0];
        if (item.brand_id == 1) {
            item.brand_id = "Nike"
        } else if (item.brand_id == 2) {
            item.brand_id = "Adidas"
        } else {
            item.brand_id = "Bitis"
        }
    }


    res.render('Owner/Product/allProduct', {
        title: 'Tất cả sản phẩm | Blue Cloud',
        cssP: () => 'OwnerProduct/cssProduct',
        scriptsP: () => 'OwnerProduct/scriptProduct',
        Packages: items,
        brands,
        price,
        brand: paramStrBrand,
        page,
        search: preSearch,
        filter,
        total_page,
    });
});


//[GET] /allproduct/add-item
router.get('/add-item', async(req, res) => {

    const { error, create } = req.query;
    const items = 0;

    const brands = await getBranches();

    res.render("Owner/Product/addItem", {
        title: 'Thêm sản phẩm mới | Blue Cloud',
        cssP: () => 'OwnerProduct/cssAdd',
        scriptsP: () => 'OwnerProduct/scriptAdd',
        items,
        brands: brands,
        create,
    });
});


//[POST] /allproduct/add-item

router.post('/add-item', upload.array("images"), async(req, res) => {

    var { name, size, price, brand, quantity } = req.body;
    var images = req.files.map((file) => file.filename);

    try {
        if (!name || !size || !price || images.length === 0) {
            return res.redirect('/allproduct/add-item?create=001');
        }

        price = price.replace(/\,/g, '');
        price = price.replace(/\ /g, '');
        var countSize = (size.match(/\,/g) || []).length;
        var countQuantity = (quantity.match(/\,/g) || []).length;
        name = name.toLowerCase();
        name = name.trim();
        name = name.replace(/\'/g, '');

        if (countSize != countQuantity) {
            return res.redirect('/allproduct/add-item?create=002');

        }

        const isExist = await getShoeByName(name);

        if (isExist.length > 0) {
            return res.redirect('/allproduct/add-item?create=003');

        }
        const newShoe = await addOneShoe(name, `{${images}}`, brand, `{${size}}`, price, `{${quantity}}`);

        if (newShoe.length > 0) {
            res.redirect('/allproduct/add-item?create=success');
        } else {
            return res.redirect('/allproduct/add-item?create=error');
        }
    } catch (err) {
        return res.redirect('/allproduct/add-item?create=error');
    }
});

//[GET] /allproduct/:id/detail

router.get('/:id/detail', async(req, res) => {

    const { update } = req.query
    const idShoe = req.params.id;
    const item = await getShoeByIdOwner(idShoe);
    const brands = await getBranches();


    item.price = priceForShow(item.price);
    item.shoes_name = ucwords(item.shoes_name, true);


    res.render("Owner/Product/updateItem", {
        title: `Thông tin sản phẩm - ${item.shoes_name} | Blue Cloud`,
        cssP: () => 'OwnerProduct/cssUpdateItem',
        scriptsP: () => 'OwnerProduct/scriptUpdateItem',
        item,
        brands,
        update,
    });
});

//[POST] /allproduct/:id/detail

router.post('/:id/detail', upload.array("images"), async(req, res) => {

    const idShoe = req.params.id;
    var { name, brand, price, images, size, stock } = req.body;

    name = name.toLowerCase();
    name = name.trim();
    name = name.replace(/\'/g, '');


    for (let index = 0; index < size.length - 1; index++) {
        for (let j = index + 1; j < size.length; j++) {
            if (size[index] == "" || size[j] == "" || size[index] == size[j]) {
                return res.redirect(`/allproduct/${idShoe}/detail?update=error`);
            }
        }
    }

    const shoe = await getShoeByIdOwner(idShoe);
    images = req.files.map((file) => file.filename);
    price = price.replace(/\,/g, '');
    price = price.replace(/\ /g, '');

    if (images.length == 0) {
        images = shoe.image;
    }
    const item = await updateOneRow({ ID: idShoe, name: name, image: `{${images}}`, brand_id: brand, size: `{${size}}`, price: price, stock: `{${stock}}` });


    if (item.length < 0 || !item) {
        res.redirect(`/allproduct/${idShoe}/detail?update=error`);
    } else {
        res.redirect(`/allproduct/${idShoe}/detail?update=success`);

    }
});


//[DELETE] /allproduct/:id/delete
router.delete('/:id/delete', async(req, res) => {

    const id = req.params.id;
    const { page, brand, price, filter, search } = req.query;


    var paramBrand = ``; // tham so truy van
    if (brand) {
        for (elm of brand) {
            paramBrand += `&brand=${elm}`;
        }
    }
    const itemCart = await delOneShoeInCart(id);
    if (itemCart.length < 0 || !itemCart) {
        return res.redirect("/allproduct?del=error");
    }
    const itemShoe = await delOneShoe(id);

    if (itemShoe.length < 0 || !itemShoe) {
        return res.redirect("/allproduct?del=error");
    }

    return res.redirect(`/allproduct?del=success&page=${page}&search=${search}${paramBrand}&price=${price}&filter=${filter}`);

})

module.exports = router;
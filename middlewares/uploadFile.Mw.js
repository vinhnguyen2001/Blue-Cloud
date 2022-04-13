const multer = require("multer");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log(12334);
        cb(null, "./public/image");
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);

    },
});

module.exports = multer({ storage: storage });
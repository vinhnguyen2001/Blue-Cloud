$(document).ready(function() {
    $('.carousel').slick({
        autoplay: true,
        autoplaySpeed: 8000,
        prevArrow: "<button type='button' class='slick-prev pull-left'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
        nextArrow: "<button type='button' class='slick-next pull-right'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
        dots: true,


    });

    $('.product').slick({
        slidesToShow: 4,
        slidesToScroll: 4,
        prevArrow: "<button type='button' class='slick-prev pull-left'><i class='fa fa-angle-left' aria-hidden='true'></i></button>",
        nextArrow: "<button type='button' class='slick-next pull-right'><i class='fa fa-angle-right' aria-hidden='true'></i></button>",
    });
});




const turnUp = (obj) => {

    var elmChidlFront = obj.children[0];
    var elmChidlBack = obj.children[1];

    elmChidlFront.style.display = "none";
    elmChidlBack.style.display = "block";

}

const disappear = (obj) => {
    var elmChidlFront = obj.children[0];
    var elmChidlBack = obj.children[1];

    elmChidlFront.style.display = "block";
    elmChidlBack.style.display = "none";
}

const showPurchasegoods = (obj) => {
    var btnPurchase = obj.children[4];
    btnPurchase.style.display = "block";
}
const hidePurchasegoods = (obj) => {
    var btnPurchase = obj.children[4];
    btnPurchase.style.display = "none";
}
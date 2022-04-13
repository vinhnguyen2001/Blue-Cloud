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
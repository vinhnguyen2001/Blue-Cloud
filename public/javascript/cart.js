var isChanged = false;

const priceForShow = (price) => {
    price = parseInt(price);
    return String(price).replace(/(.)(?=(\d{3})+$)/g, '$1,');
}




const checkValidation = (obj, preValue, quantity) => {

    const parentElm = quantity.parentNode;
    const price = parentElm.querySelector(".cart__price");
    const pricePerItem = parentElm.querySelector('.price').innerText;

    if (parseInt(obj.value) > parseInt(obj.max)) {

        showErrorModal("Số lượng lớn hơn số lượng đang có sẵn");
        obj.value = preValue;
    } else if (parseInt(obj.value) < parseInt(obj.min)) {
        showErrorModal("Số lượng không phù hợp");
        obj.value = preValue;
    } else {

        price.innerText = priceForShow(parseInt(obj.value) * parseInt(pricePerItem));
        const prices = document.querySelectorAll(".cart__price");
        let totalPrice = document.querySelector("#sumPrice");
        console.log("sumPrice", totalPrice);
        let sumPrice = 0;
        for (elm of prices) {

            let newString = elm.innerText.replace(/,/g, "");
            sumPrice += parseInt(newString);
        }
        totalPrice.innerText = priceForShow(sumPrice);
    }
    isChanged = true;

}

const buyingItems = async() => {
    const IDs = document.getElementsByClassName("cart-content-id");
    const quantities = document.getElementsByClassName("cart--quantity");

    var idArr = [];
    var quantityArr = [];
    for (let i = 0; i < IDs.length; i++) {
        idArr.push(IDs[i].innerText);
        quantityArr.push(quantities[i].value);
    }

    if (isChanged == true) {
        const data = { id: idArr, quantity: quantityArr };
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // chuyển đổi thành json và truyền đi
            body: JSON.stringify(data),
        }
        try {

            const resJson = await fetch("/giohang", options);
            const { status } = await resJson.json();

            if (status == success) {
                location.assign('/thanhtoan/thongtin');
            } else {
                throw Error("Error for update items in cart");
            }
        } catch (err) {
            console.error("error for buying: ", err);
        }
    }
    location.assign('/thanhtoan/thongtin');


}
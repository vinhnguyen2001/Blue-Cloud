const sizes = document.querySelectorAll('.info--size');
const stocks = document.querySelectorAll('.stock')

// console.log("type ", Object.keys(sizes));

const selectSize = (obj) => {

    // console.log(Object.keys(obj))
    count = 0;
    for (let elm of sizes) {
        elm.classList.remove("size-detail-active")
    }

    for (let elm of sizes) {
        count++;
        if (elm === obj) {
            break;
        }
    }

    // console.log(count);
    obj.classList.add("size-detail-active");
    for (let elm of stocks) {
        elm.classList.remove("stock-active")
    }
    stocks[count - 1].classList.add("stock-active");

}
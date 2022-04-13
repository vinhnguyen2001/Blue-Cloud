const formSelect = document.querySelector('.form-select');
const checkItem = document.querySelectorAll('.form__check--item');
const product = document.querySelector('.product')

formSelect.onsubmit = async(e) => {
    e.preventDefault();
    const search = document.querySelector("#search").value.trim().toLowerCase();
    const check_active = document.querySelectorAll('.check-active');
    const check_range = document.querySelector('#inputSlider');
    const price = check_range.value;
    var arrSizes = [];
    for (elm of check_active) {
        arrSizes.push(parseInt(elm.innerText));

    }


    const data = { search, arrSizes, price };
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // chuyển đổi thành json và truyền đi
        body: JSON.stringify(data),
    }

    try {

        const resJson = await fetch('/search', options);
        const { items } = await resJson.json();
        product.innerHTML = "";
        if (items.length == 0) {
            $(".product").append(` 
            <div id="notfound">
            <i class="fa-solid fa-triangle-exclamation"></i>
            <h2>
                Không tìm thấy sản phẩm phù hợp 
             </h2></div>
            `)
            return;
        }
        for (let elm of items) {
            $(".product").append(
                `
            <div class="product__item" onmouseover="showPurchasegoods(this)" onmouseout="hidePurchasegoods(this)">
                <div class="product__item--img img--bitis">
                    <img src="../../image/${elm.image}" alt="photo1" width="100%">
                </div>
                
                <div class="product__size" onmouseover="turnUp(this)" onmouseout="disappear(this)">
                    <div class="product__size--front">
                        <span class="product__size-item">+${elm.size.length} size</span>
                    </div>
                    <div class="product__size--back">
                   
                    </div>
                </div>
                <div class="product__name">
                    <a href="/shoes/${elm.shoes_id}/detail">
                        <p class="p-name">${elm.shoes_name}</p>
                    </a>
                </div>
                <div class="product__price">
                ${elm.price} đ
                </div>

                <div class="product__buy btn" onclick="addItem(this)">
                    <button>
                        Thêm vào giỏ hàng
                    </button>
                </div>
                <div class="shoe_id">${elm.shoes_id}</div>
            </div>
            `
            )

        }
        $('.product__size--back').empty();
        const backSide = document.querySelectorAll(".product__size--back");
        let index = 0;
        for (elm of items) {
            for (value of elm.size) {
                backSide[index].innerHTML += ` <span class="product__size-item" onclick="chooseSize(this)">${value}</span>`;
            }
            index++;
        }
    } catch (e) {
        console.error("error search: ", e);
    }

}

const selectSize = (obj) => {
    if (obj.classList.contains('check-active')) {
        obj.classList.remove('check-active');
    } else {
        obj.classList.add('check-active');
    }

}

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
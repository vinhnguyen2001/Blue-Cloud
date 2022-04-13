const slideValue = document.querySelector("#span-value");
const inputSlider = document.querySelector("#inputSlider");

inputSlider.oninput = () => {
    let value = inputSlider.value;
    slideValue.textContent = value;
    slideValue.style.left = (value / 2) + "%";
    slideValue.classList.add("show");
};
// inputSlider.onblur = (() => {
//     slideValue.classList.remove("show");
// });

function ucfirst(str, force) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/, function(firstLetter) {
        return firstLetter.toUpperCase();
    });
};

function ucwords(str, force) {
    str = force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g, function(firstLetter) {
        return firstLetter.toUpperCase();
    });
};

document.addEventListener('DOMContentLoaded', function() {
    // Phần của remove
    const brand = document.getElementsByClassName('accept');

    console.log("rakhong:", brand.length);
    const price = document.getElementById('span-value').innerText;
    const filter = document.getElementById('filter').value;
    const page = document.getElementById('curpage').value;
    const search = document.getElementById('search').value;

    console.log("rakhong:", price, filter, page, search);
    var paramBrand = ``;

    for (elm of brand) {

        if (elm.checked == true) {
            paramBrand += `&brand=${elm.value}`;
        }
    }
    console.log("query: ", paramBrand);


    var btnRemove = document.getElementById("confirmbtn");
    var removeForm = document.forms['removeForm'];
    var shoe_id = 0;

    // Khi remove modal hiện lên
    $('#removeModal').on('show.bs.modal', function(event) {
        var passBtn = $(event.relatedTarget);
        var shoe_name = ucwords(passBtn.data('name'), true);
        shoe_id = passBtn.data('id');
        $('#removeModalHead').text("Xóa sản phẩm");
        $('#removeModalMsg').text(`  Bạn có chắc chắn muốn xóa giày ${shoe_name} khỏi giỏ hàng?`);
    });

    btnRemove.onclick = function() {
        // xóa một sản phẩm
        removeForm.action = '/allproduct/' + shoe_id + '/delete' + `?_method=DELETE&page=${page}${paramBrand}&price=${price}&filter=${filter}&search=${search}`;
        return removeForm.submit();
    };
});
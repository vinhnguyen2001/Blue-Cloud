window.addEventListener("DOMContentLoaded", () => {

    const btnConfirm = document.querySelector("#confirmbtn");
    const form = document.querySelector("#form__edit");
    const btnCreate = document.querySelector(".btn__create");



    btnCreate.addEventListener("click", () => {
        const infoSize = document.querySelector(".info__size");
        const infoStock = document.querySelector(".info__stock");
        infoSize.innerHTML += `
        <div class="info__size--item">
            <input type="number" onchange="checkValidation(this,0)" min="0" max="50" step="1" name="size">
        </div>
        `
        infoStock.innerHTML += `
        <div class="info__stock--item">
            <input type="number" onchange="checkValidation(this,0)" min="0" name="stock">
        </div>
        `
    });

    btnConfirm.onclick = () => {
        form.submit();
    };

});


const updateList = function() {
    var input = document.getElementById('file');
    var output = document.getElementById('file-content');

    var temp = "";
    for (var i = 0; i < input.files.length; ++i) {
        temp += `${input.files.item(i).name},`;
    }
    output.innerText = temp.slice(0, -1);
};

const checkValidation = (elm, preValue) => {
    if (parseInt(elm.value) < 0) {
        elm.value = preValue;
    }
};
window.addEventListener("load", function(e) {
    const pathname = window.location.pathname.split("/")[1];
    if (pathname == "") {
        return;
    }
    const menuItems = document.querySelectorAll(".nav__menu--item");

    for (elm of menuItems) {
        let value = elm.innerText.toLowerCase();
        if (value.includes(pathname)) {
            elm.classList.add("nav__menu--active");
        }
    }



})

window.onload = () => {
    const pages = document.querySelectorAll(".page-order");
    const value = document.querySelector("#page-active");
    for (elm of pages) {

        if (elm.innerText == value.value) {
            elm.classList.add("page-item-active");
        }
    }
}
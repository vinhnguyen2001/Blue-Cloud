const modalNoti = ({ msg, type, duration = 3000, buy }) => {
    const main = document.getElementById("modal-mgs");
    if (main) {

        const header = document.querySelector(".navigation");
        const container = document.querySelector(".container");
        container.classList.add("background-blur");
        header.classList.add("background-blur");

        const modal = document.createElement("div");
        const close = document.getElementById("btn-close");
        modal.classList.add("modal-mgs");
        // Auto remove toast
        const autoRemoveId = setTimeout(function() {
            main.removeChild(modal);
            container.classList.remove("background-blur");
            header.classList.remove("background-blur");
        }, duration + 1000);

        // Remove model when clicked

        modal.onclick = function(e) {
            if (e.target.closest(".btn--close")) {
                main.removeChild(modal);
                container.classList.remove("background-blur");
                header.classList.remove("background-blur");
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-exclamation-circle",
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);
        modal.style.animation = `slideInTop ease .3s, fadeOut linear 1s ${delay}s forwards`;

        if (type == "success" && buy == "true") {
            modal.innerHTML =
                ` <div class="modal-mgs__title ">
            <h4>Thông báo</h4>
            </div>
            <div class="modal-mgs__body ">
                <p>${msg} <i class="${icon}"></i></p>
            </div>
            <div class= "modal-mgs--button">
                <div >
                    <a href="/giohang" id="btn-link-cart">
                    Xem giỏ hàng
                    </a>
                </div>
                <div class="btn--close">
                    <a>Đóng</a>
                </div>
            </div>
        `;
        } else {
            modal.innerHTML =
                ` <div class="modal-mgs__title ">
                <h4>Thông báo</h4>
                </div>
                <div class="modal-mgs__body ">
                    <p>${msg} <i class="${icon}"></i></p>
                </div>
                <div class= "modal-mgs--button">
                    <div class="btn--close">
                        <a>Đóng</a>
                    </div>
                </div>
                `;
        }

        main.appendChild(modal);
    }
}

function showSuccessModalForBuying(message, buy) {
    modalNoti({
        msg: message,
        type: "success",
        duration: 3000,
        buy,
    })
}

function showSuccessModal(message) {
    modalNoti({
        msg: message,
        type: "success",
        duration: 3000,
    })
}

function showErrorModal(message) {
    modalNoti({
        msg: message,
        type: "error",
        duration: 2000,
    })
}
// showErrorModal("Thất bại");
// Chọn size giày
const chooseSize = (obj) => {
    const parentElement = obj.parentNode;

    const backSide = parentElement.children;

    for (elm of backSide) {
        elm.classList.remove('size-item-active');
    }

    obj.classList.add('size-item-active');
}
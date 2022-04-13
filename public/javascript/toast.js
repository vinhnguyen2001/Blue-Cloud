const toast = ({ title = "", message = "", type = "info", duration }) => {
    const main = document.getElementById("toast-msg");
    if (main) {
        const toast = document.createElement("div");

        // Auto remove toast
        const autoRemoveId = setTimeout(function() {
            main.removeChild(toast);
        }, duration + 1000);

        // Remove toast when clicked
        toast.onclick = function(e) {
            if (e.target.closest(".toast-msg__close")) {
                main.removeChild(toast);
                clearTimeout(autoRemoveId);
            }
        };

        const icons = {
            success: "fas fa-check-circle",
            error: "fas fa-exclamation-circle",
        };
        const icon = icons[type];
        const delay = (duration / 1000).toFixed(2);

        toast.classList.add("toast-msg", `toast-msg--${type}`);
        toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${delay}s forwards`;

        toast.innerHTML = `
                          <div class="toast-msg__icon">
                              <i class="${icon}"></i>
                          </div>
                          <div class="toast-msg__body">
                              <h3 class="toast-msg__title">${title}</h3>
                              <p class="toast-msg__msg">${message}</p>
                          </div>
                          <div class="toast-msg__close">
                              <i class="fas fa-times"></i>
                          </div>
                      `;
        main.appendChild(toast);
    }
}

function showSuccessToast(message) {
    toast({
        title: "Thành công!",
        message: message,
        type: "success",
        duration: 3000,
    });
}

function showErrorToast(message) {
    toast({
        title: "Thất bại!",
        message: message,
        type: "error",
        duration: 3000,
    });
}
// showSuccessToast("thanh cong");
// showSuccessToast("thanh cong");
// showSuccessToast("thanh cong");
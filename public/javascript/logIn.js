const userName = document.getElementById("userName");
const password = document.getElementById("password");
const form = document.querySelector('.form');

form.onsubmit = async(e) => {

    e.preventDefault();
    const errs = checkInputs();
    const uservalue = userName.value.trim();
    const passvalue = password.value.trim();
    const data = { uservalue, passvalue, errs };

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        // chuyển đổi thành json và truyền đi
        body: JSON.stringify(data),
    }
    try {
        const result = await fetch('/dangnhap', options);
        const resData = await result.json();

        console.log("resdata", "có vao ", resData);
        // lấy error về và thông báo lỗi
        if (!resData.status) {
            if (resData.userErr != '') {
                setErrorFor(userName, resData.userErr);
            } else {
                setSuccessFor(userName);
            }
            if (resData.passErr != '') {
                setErrorFor(password, resData.passErr);
            } else {
                setSuccessFor(password);
            }

            // location.assign('/dangnhap');

        } else {

            const port = window.location.port;
            console.log("port", port);
            if (port == "4000") {
                if (resData.role != 1) {
                    deleteAllCookies();
                    setErrorFor(userName, "Bạn không có quyền truy cập");
                } else {
                    location.assign('/home');
                }
            } else {
                location.assign('/');
            }

        }

    } catch (err) {
        console.log("error signin: ", err);
    }
};


function checkInputs() {

    // trim to remove the whitespaces
    const userNameValue = userName.value.trim();


    errs = { userErr: '' };
    // check validation userName
    if (userNameValue === '') {

        errs.userErr = "Tên đăng nhập không được để trống";
    } else {
        errs.userErr = isUserName(userNameValue);
    }

    return errs;
}

function setErrorFor(input, message) {
    const formControl = input.parentElement;
    const small = formControl.querySelector('small');
    formControl.className = 'form-item error';
    small.innerText = message;
}


function isUserName(userN) {
    var userNamePattern = /^[a-zA-Z]+\w+$/i.test(userN);
    var err = ''
    if (!userNamePattern) {

        var temp = userN.charCodeAt(0);

        if (48 <= temp && temp <= 57) {
            err = 'Kí tự đầu tên đăng nhập không bắt đầu từ kí số';
            return err;
        }

        for (var i = 1; i < userN.length; i++) {
            if (userN[i] == " ") {
                err = 'Tên đăng nhập không chứa khoảng trắng';
                return err;
            }
        }

    }
    return err;
}

function setSuccessFor(input) {
    const formControl = input.parentElement;
    formControl.className = 'form-item success';
}
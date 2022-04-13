const search = document.querySelector('#search').value;
const page = document.querySelector(".pag__link--active").innerText;

document.addEventListener('DOMContentLoaded', function() {
    var o_id;
    // Phần hủy hóa đơn
    var btnRemove = document.getElementById("btnRemove");
    var removeForm = document.forms['removeForm'];

    // Khi remove modal hiện lên
    $('#removeModal').on('show.bs.modal', function(event) {
        var passBtn = $(event.relatedTarget);

        o_id = passBtn.data('o_id');

        $('#removeModalMsg').text(`
          Bạn có chắc muốn hủy đơn hàng #${o_id}
          `);
    });

    // Khi click vào nút có trong remove modal
    btnRemove.onclick = function() {
        removeForm.action = '/allorders/' + o_id + `?_method=DELETE&search=${search}&page=${page}`;
        removeForm.submit();
    };

    // Phân sửa hóa đơn
    var o_phone;
    var o_address;
    var o_status;
    var btnUpdate = document.getElementById("btnUpdate");
    var updateForm = document.forms['updateForm'];


    // Khi update modal hiện lên
    $('#updateModal').on('show.bs.modal', function(event) {
        var passBtn = $(event.relatedTarget);

        o_id = passBtn.data('o_id');
        o_phone = passBtn.data('o_phone');
        o_address = passBtn.data('o_address');
        o_status = passBtn.data('o_status');
        console.log("status of order:", passBtn.data('o_status'));
        if (o_status == "Đã thanh toán") {
            document.getElementById("paid").checked = 'checked';
        } else if (o_status == "Chưa thanh toán") {
            document.getElementById("unpaid").checked = 'checked';
        }
        $('#updateModalHead').text(`Sửa hoá đơn`);
        document.getElementById("modalUId").value = `#${o_id}`;
        document.getElementById("modalUPhone").value = o_phone;
        document.getElementById("modalUAddress").value = o_address;

    });


    // Khi ấn nút xác nhận chỉnh sửa
    btnUpdate.onclick = function() {
        let testPhone = updateForm.o_phone.value;
        let testAddress = updateForm.o_address.value;
        let updateError = false;

        // Nếu không nhập sđt
        if (!testPhone) {
            updateError = true;
            document.getElementById("formBack1").setAttribute('class', "alert alert-danger");
            $('#formBack1').text("Vui lòng nhập vào trường này.");
        } else {
            document.getElementById("formBack1").setAttribute('class', "");
            $('#formBack1').text("");
        }

        // Nếu không nhập địa chỉ
        if (!testAddress) {
            updateError = true;
            document.getElementById("formBack2").setAttribute('class', "alert alert-danger");
            $('#formBack2').text("Vui lòng nhập vào trường này.");
        } else {
            document.getElementById("formBack2").setAttribute('class', "");
            $('#formBack2').text("");
        }

        if (updateError) return;

        updateForm.action = '/allorders/' + o_id + `?_method=PUT&search=${search}&page=${page}`;
        updateForm.submit();
    }
});
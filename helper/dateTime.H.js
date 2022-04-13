// Chuyển ngày giờ phù hợp
exports.convertDate = (time) => {

    const date = (time.getDate() < 10 ? "0" : "") + time.getDate();
    const month = (time.getMonth() < 10 ? "0" : "") + (time.getMonth() + 1);
    const year = (time.getFullYear() < 10 ? "0" : "") + time.getFullYear();

    const day = `${date}-${month}-${year}`;
    const hour = (time.getHours() < 10 ? "0" : "") + time.getHours();
    const minute = (time.getMinutes() < 10 ? "0" : "") + time.getMinutes();
    const second = (time.getSeconds() < 10 ? "0" : "") + time.getSeconds();
    const atTime = `${hour}:${minute}:${second}`;

    return `${day} ${atTime}`;
};
const getMonth = () => {

    const form = document.querySelector('#form-month');

    form.submit();
}
const year = new Date().getFullYear();
var curMonth = document.querySelector('.curmonth').value;


// setup the data
const dataForProductSold = JSON.parse(document.querySelector("#saleProductValue").value);

const ProductSold = {
    labels: ['Nike', 'Adidas', 'Bitis Hunter'],
    datasets: [{
        data: dataForProductSold,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',

        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
    }]
};


const dataForLineChart = JSON.parse(document.querySelector("#lineChartValue").value);

const data = {
    labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', "August", "Sept", "Oct", "Nov", "Dec"],
    datasets: [{
        lable: '',
        data: dataForLineChart,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
}

const dataForRevenue = JSON.parse(document.querySelector("#revenueValue").value);

const dataRevenue = {
    labels: ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', "August", "Sept", "Oct", "Nov", "Dec"],
    datasets: [{
        lable: '',
        data: dataForRevenue,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
}

const dataForPieChart = JSON.parse(document.querySelector("#pieChartValue").value);

const dataPie = {
    labels: ["Nike", "Adidas", "Bitis Hunter"],
    datasets: [{
        label: '# of Votes',
        data: dataForPieChart,
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',

        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1
    }]
}

// config
const config = {
    type: 'bar',
    data: ProductSold,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: `Doanh Số Giày Đã Bán Trong Tháng ${curMonth} Năm ${year}`,
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        }
    }
}

const configPie = {
    type: 'pie',
    data: dataPie,
    options: {
        plugins: {
            title: {
                display: true,
                text: `Phần Trăm Giày Bán Trong Năm ${year}`,
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        }
    }
}
const configLine = {
    type: 'line',
    data: data,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: `Doanh Số Giày Đã Bán Trong Năm ${year}`,
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        }
    }
}
const configRevenue = {
    type: 'line',
    data: dataRevenue,
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: `Doanh Thu Trong Năm ${year} (đơn vị: VND)`,
                padding: {
                    top: 10,
                    bottom: 30
                }
            }
        }
    }
}


// render init block
const chartSaleProduct = new Chart(
    document.getElementById('saleProduct'),
    config
);
const chartPercentage = new Chart(
    document.getElementById('pieChart'),
    configPie
);
const chartTotalProductSold = new Chart(
    document.getElementById('lineChart'),
    configLine
);
const chartRevenue = new Chart(
    document.getElementById('lineChartRevenue'),
    configRevenue
);


// var ctx = document.getElementById('myChart').getContext('2d');

// var myChart = new Chart(ctx, config);
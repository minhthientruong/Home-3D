/*
    Designed by: Jarlan Perez
    Original image: https://www.artstation.com/artwork/VdBllN

*/


const h = document.querySelector("#h");
const b = document.body;

let base = (e) => {
    var x = e.pageX / window.innerWidth - 0.5;
    var y = e.pageY / window.innerHeight - 0.5;
    h.style.transform = `
        perspective(90vw)
        rotateX(${ y * 10  + 75}deg)
        rotateZ(${ -x * 25  + 45}deg)
        translateZ(-9vw)
    `;
}

b.addEventListener("pointermove", base);
const theSwitch = document.getElementById('the_switch');  /* Tạo tham chiếu tới phần tử HTML có id là 'the_switch' */
let configLed = null, newStatusLed = null, actions = [];  /* Khởi tạo các biến dùng để lưu cấu hình và trạng thái đèn LED  */

/* Tạo đối tượng EraWidget và gọi hàm khởi tạo với các cấu hình cần thiết */
const eraWidget = new EraWidget();
eraWidget.init({
    needRealtimeConfigs: true,         /* Cần giá trị hiện thời */
    needHistoryConfigs: true,          /* Cần giá trị lịch sử */
    needActions: true,                 /* Cần các hành động (ví dụ Bật/Tắt đèn) */
    maxRealtimeConfigsCount: 3,        /* Số lượng tối đa giá trị hiện thời */
    maxHistoryConfigsCount: 1,         /* Số lượng tối đa giá trị lịch sử */
    maxActionsCount: 2,                /* Số lượng tối đa các hành động có thể kích hoạt */
    minRealtimeConfigsCount: 0,        /* Số lượng tối thiểu giá trị hiện thời */
    minHistoryConfigsCount: 0,         /* Số lượng tối thiểu giá trị lịch sử */
    minActionsCount: 0,                /* Số lượng tối thiểu hành động */
    mobileHeight: 300,                 /* Thiết lập chiều cao hiển thị trên mobile app E-Ra, mặc đinh 300px */

    /* Hàm callback được gọi khi có cấu hình được nhận từ server */
    onConfiguration: (configuration) => {
        /* Cập nhật cấu hình đèn LED từ cấu hình thời gian thực đầu tiên */
        configLed = configuration.realtime_configs[0];
        actions = configuration.actions; /* Lưu danh sách các hành động được nhận */
    },

    /* Hàm callback được gọi khi nhận giá trị mới từ server */
    onValues: (values) => {
        /* Lấy trạng thái hiện tại của đèn LED từ giá trị của cấu hình */
        const stateLed = values[configLed.id].value;

        /* Kiểm tra nếu trạng thái đèn thay đổi */
        if (newStatusLed !== stateLed) {
            newStatusLed = stateLed;      /* Cập nhật trạng thái mới của đèn */
            theSwitch.checked = stateLed; /* Thay đổi trạng thái của switch dựa trên trạng thái đèn */
        }
    },
});

/* Thêm sự kiện khi người dùng nhấp vào switch để kích hoạt hành động */
theSwitch.addEventListener('click', () => {
    if (newStatusLed === 1) {
        eraWidget.triggerAction(actions[1]?.action, null); /* Kích hoạt hành động 'Tắt' */
    } else {
        eraWidget.triggerAction(actions[0]?.action, null); /* Kích hoạt hành động 'Bật' */
    }
});


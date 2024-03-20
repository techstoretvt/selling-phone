import axios from 'axios';
import { decode_token_exp } from '../services/common';
import { IgnoreUrl } from '../utils/helpers';

const instance = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    // withCredentials: true
});

let isRefreshing = false;
const requestQueue = [];

instance.interceptors.request.use(
    (config) => {
        if (IgnoreUrl(config.url)) return config;

        // Kiểm tra token hết hạn
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            // Nếu không tồn tại accessToken, trả về một Promise.reject với giá trị { code: -1 }
            return Promise.reject({
                response: {
                    data: { errCode: 401 },
                },
            });
        }

        let time_decode = decode_token_exp(accessToken);
        let now = Math.floor(new Date().getTime() / 1000);
        // console.table({ time_decode, now })
        if (time_decode && time_decode < now) {
            // Nếu token đã hết hạn, và không có yêu cầu nào đang được thực hiện,
            // gọi API làm mới token và lưu trữ promise trả về
            if (!isRefreshing) {
                console.log('Start refreshToken.');
                isRefreshing = true;

                const refreshToken = localStorage.getItem('refreshToken');
                axios
                    .post(
                        `${process.env.REACT_APP_BACKEND_URL}/api/refresh-token`,
                        { refreshToken }
                    )
                    .then((response) => {
                        const data = response.data;
                        const newToken = data.data.accessToken;
                        console.log('End refreshToken.');
                        localStorage.setItem(
                            'accessToken',
                            data.data.accessToken
                        );
                        localStorage.setItem(
                            'refreshToken',
                            data.data.refreshToken
                        );

                        isRefreshing = false;
                        // Gửi lại tất cả các yêu cầu đang chờ trong hàng đợi
                        requestQueue.forEach((queuedRequest) => {
                            queuedRequest.headers.Authorization = `Bearer ${newToken}`;
                            axios(queuedRequest)
                                .then((response) => {
                                    // Xử lý phản hồi thành công
                                    queuedRequest.resolve(response.config);
                                })
                                .catch((error) => {
                                    // Xử lý lỗi
                                    console.log('api error: ', error);
                                    queuedRequest.reject(error);
                                });
                        });
                        // Xóa tất cả các yêu cầu trong hàng đợi
                        requestQueue.length = 0;
                    })
                    .catch((error) => {
                        console.log('refreshToken fail: ', error);
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        requestQueue.length = 0;
                    });
            }
            // Nếu token đã hết hạn, và có yêu cầu đang được thực hiện,
            // thêm yêu cầu vào hàng đợi
            return new Promise((resolve, reject) => {
                requestQueue.push({
                    ...config,
                    resolve,
                    reject,
                });
            });
        }
        // Trả về config của yêu cầu nếu token chưa hết hạn

        config.headers['Authorization'] = `Bearer ${localStorage.getItem(
            'accessToken'
        )}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

instance.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        // Xử lý lỗi khi gặp lỗi trong phản hồi
        return Promise.reject(error);
    }
);

export default instance;

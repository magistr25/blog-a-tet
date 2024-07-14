import axios from "axios";

const instance = axios.create({
    baseURL: "http://127.0.0.1:4444/",
});

instance.interceptors.request.use(config => {
    const token = window.localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    console.error('Request error:', error);
    return Promise.reject(error);
});

instance.interceptors.response.use(response => {
    try {
        // Проверка, что ответ является JSON
        JSON.parse(JSON.stringify(response.data));
    } catch (error) {
        console.error('Invalid JSON response:', response.data);
        return Promise.reject(new Error('Invalid JSON response'));
    }
    return response;
}, error => {
    if (error.response && error.response.status === 401) {
        console.error('Unauthorized access - possibly due to invalid token.');
    } else if (error.response && error.response.data) {
        console.error('Response error data:', error.response.data);
    } else {
        console.error('Response error:', error);
    }
    return Promise.reject(error);
});

export default instance;


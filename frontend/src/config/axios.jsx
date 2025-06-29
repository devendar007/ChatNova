import axios from 'axios';

// Fallback URL if environment variable is not set
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-url.onrender.com';

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
        "Content-Type": "application/json"
    },
    timeout: 10000
});

// Add request interceptor to handle token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;   
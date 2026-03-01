import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";
import { API_ROUTES } from "../constants/apiRoutes";

const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_ROUTES.BASE,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Attach auth token if it exists in future
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

// ---- Response Interceptor ----
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        const message =
            (error.response?.data as { message?: string })?.message ??
            error.message ??
            "An unexpected error occurred";

        console.error(`[API Error] ${error.response?.status}: ${message}`);
        return Promise.reject(new Error(message));
    }
);

export default axiosInstance;

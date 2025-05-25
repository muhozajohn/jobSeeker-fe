import axios, {
    AxiosInstance,
    InternalAxiosRequestConfig,
    AxiosResponse,

} from "axios";

const http: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 15000,
});


const requestHandler = (
    request: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");

        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }

        if (
            !request.headers["Content-Type"] &&
            !(request.data instanceof FormData)
        ) {
            request.headers["Content-Type"] = "application/json";
        }
    }
    return request;
};

const responseHandler = (response: AxiosResponse): AxiosResponse => {
    return response;
};


http.interceptors.request.use(requestHandler);
http.interceptors.response.use(responseHandler);

export default http;
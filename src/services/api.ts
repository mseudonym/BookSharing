import axios, {AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig} from 'axios';
import { getToken } from './token';

export const AXIOS_INSTANCE = axios.create(
    {
        baseURL: import.meta.env.VITE_BS_API_BASE_URL,
        timeout: import.meta.env.REQUEST_TIMEOUT,
    }
);

AXIOS_INSTANCE.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token && config.headers) {
        config.headers['Authorization'] = token;
    }

    return config;
});


export const api = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const axiosInstance = AXIOS_INSTANCE({
        ...config,
        ...options,
    }).then(({data}) => data);

    return axiosInstance;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

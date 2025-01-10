import Axios, {AxiosError, AxiosRequestConfig} from 'axios';

export const AXIOS_INSTANCE = Axios.create(
    {
        baseURL: import.meta.env.VITE_BS_API_BASE_URL,
        withCredentials: true,
    }
);

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

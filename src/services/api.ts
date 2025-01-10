import Axios, {AxiosError, AxiosRequestConfig} from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: 'http://localhost:5287' });

export const api = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const axiosInstance = AXIOS_INSTANCE({
        ...config,
        ...options,
    }).then(({ data }) => data);

    return axiosInstance;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

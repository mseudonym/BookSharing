import Axios, {AxiosError, AxiosRequestConfig} from 'axios';

export const AXIOS_INSTANCE = Axios.create({ baseURL: '<BACKEND URL>' }); // use your own URL here or environment variable

export const api = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
): Promise<T> => {
    const axiosInstance = AXIOS_INSTANCE({
        ...config,
        ...options,
        baseURL: process.env.BS_API_BASE_URL
    }).then(({ data }) => data);

    console.log("process.env.BS_API_BASE_URL");
    console.log(process.env.BS_API_BASE_URL);

    return axiosInstance;
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

import axios, { AxiosError, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { getToken, refreshAuthLogic } from './token';

export const AXIOS_INSTANCE = axios.create(
  {
    baseURL: import.meta.env.VITE_BS_API_BASE_URL,
    timeout: import.meta.env.REQUEST_TIMEOUT,
  },
);

AXIOS_INSTANCE.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

createAuthRefreshInterceptor(AXIOS_INSTANCE, refreshAuthLogic);

export const api = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  return AXIOS_INSTANCE({
    ...config,
    ...options,
  }).then(({ data }) => data);
};

export type ErrorType<Error> = AxiosError<Error>;

export type BodyType<BodyData> = BodyData;

import { QueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (_, error) => {
        const axiosError = error as AxiosError;
        return axiosError.response?.status !== 404;
      },
    },
  },
});
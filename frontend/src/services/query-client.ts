import { QueryClient } from '@tanstack/react-query';


export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // Check if the error is a 404 (you may need to adjust based on your error structure)
        if (error?.response?.status === 404) {
          return false; // Don't retry on 404
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
    },
  },
});
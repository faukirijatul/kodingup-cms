import { QueryClient } from '@tanstack/react-query';

const ONE_SECOND = 1000;
const ONE_MINUTE = 60 * ONE_SECOND;

export const QUERY_CACHE_TIME = {
  STALE_TIME_5_MINUTES: 5 * ONE_MINUTE,
  GC_TIME_10_MINUTES: 10 * ONE_MINUTE,
} as const;

export const QUERY_RETRY_COUNT = {
  DEFAULT_QUERY_RETRY: 1,
  DEFAULT_MUTATION_RETRY: 0,
} as const;

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CACHE_TIME.STALE_TIME_5_MINUTES,
      gcTime: QUERY_CACHE_TIME.GC_TIME_10_MINUTES,
      retry: QUERY_RETRY_COUNT.DEFAULT_QUERY_RETRY,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: QUERY_RETRY_COUNT.DEFAULT_MUTATION_RETRY,
    },
  },
});

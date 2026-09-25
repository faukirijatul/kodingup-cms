import { getAuthData, refreshAccessToken } from '@/services/http/auth';

const TWENTY_MINUTES_MS = 20 * 60 * 1000;

export async function httpClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const authData = getAuthData();
  let token = authData?.token;

  if (authData) {
    const isExpired = Date.now() >= authData.expirationTime - TWENTY_MINUTES_MS;

    if (isExpired) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        token = newToken;
      }
    }
  }

  const headers = new Headers(options.headers);

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP Error: ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

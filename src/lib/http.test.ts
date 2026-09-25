import { httpClient } from './http';
import { getAuthData, refreshAccessToken } from '@/services/http/auth';

vi.mock('@/services/http/auth', () => ({
  getAuthData: vi.fn(),
  refreshAccessToken: vi.fn(),
}));

describe('httpClient', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  describe('Headers & Authorization Handling', () => {
    it('sets default Content-Type header to application/json', async () => {
      vi.mocked(getAuthData).mockReturnValue(null);
      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      await httpClient('/api/test');

      expect(globalThis.fetch).toHaveBeenCalledWith(
        '/api/test',
        expect.objectContaining({
          headers: expect.any(Headers),
        }),
      );

      const calledHeaders = vi.mocked(globalThis.fetch).mock.calls[0][1]
        ?.headers as Headers;
      expect(calledHeaders.get('Content-Type')).toBe('application/json');
    });

    it('does not set Content-Type header when body is FormData', async () => {
      vi.mocked(getAuthData).mockReturnValue(null);
      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      const formData = new FormData();
      await httpClient('/api/upload', { method: 'POST', body: formData });

      const calledHeaders = vi.mocked(globalThis.fetch).mock.calls[0][1]
        ?.headers as Headers;
      expect(calledHeaders.has('Content-Type')).toBe(false);
    });

    it('attaches Bearer token to Authorization header when authData is valid', async () => {
      const now = Date.now();
      vi.mocked(getAuthData).mockReturnValue({
        token: 'valid-token',
        expirationTime: now + 30 * 60 * 1000,
      });

      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response(JSON.stringify({ data: 'ok' }), { status: 200 }),
      );

      await httpClient('/api/protected');

      const calledHeaders = vi.mocked(globalThis.fetch).mock.calls[0][1]
        ?.headers as Headers;
      expect(calledHeaders.get('Authorization')).toBe('Bearer valid-token');
      expect(refreshAccessToken).not.toHaveBeenCalled();
    });
  });

  describe('Token Expiration & Refresh Logic', () => {
    it('refreshes token if it expires in less than 20 minutes', async () => {
      const now = Date.now();
      vi.setSystemTime(now);

      vi.mocked(getAuthData).mockReturnValue({
        token: 'old-token',
        expirationTime: now + 10 * 60 * 1000,
      });
      vi.mocked(refreshAccessToken).mockResolvedValue('new-refreshed-token');

      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      await httpClient('/api/protected');

      expect(refreshAccessToken).toHaveBeenCalledTimes(1);
      const calledHeaders = vi.mocked(globalThis.fetch).mock.calls[0][1]
        ?.headers as Headers;
      expect(calledHeaders.get('Authorization')).toBe(
        'Bearer new-refreshed-token',
      );
    });

    it('falls back to old token if refreshAccessToken returns null', async () => {
      const now = Date.now();
      vi.setSystemTime(now);

      vi.mocked(getAuthData).mockReturnValue({
        token: 'old-token',
        expirationTime: now + 5 * 60 * 1000,
      });
      vi.mocked(refreshAccessToken).mockResolvedValue(null);

      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response(JSON.stringify({ success: true }), { status: 200 }),
      );

      await httpClient('/api/protected');

      const calledHeaders = vi.mocked(globalThis.fetch).mock.calls[0][1]
        ?.headers as Headers;
      expect(calledHeaders.get('Authorization')).toBe('Bearer old-token');
    });
  });

  describe('Response Parsing & Error Handling', () => {
    it('returns empty object when response status is 204 No Content', async () => {
      vi.mocked(getAuthData).mockReturnValue(null);
      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response(null, { status: 204 }),
      );

      const result = await httpClient('/api/delete');

      expect(result).toEqual({});
    });

    it('throws custom error message from server when response is not ok', async () => {
      vi.mocked(getAuthData).mockReturnValue(null);
      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response(JSON.stringify({ message: 'Unauthorized access' }), {
          status: 401,
          statusText: 'Unauthorized',
        }),
      );

      await expect(httpClient('/api/secure')).rejects.toThrow(
        'Unauthorized access',
      );
    });

    it('throws default HTTP error status message when server error payload has no message', async () => {
      vi.mocked(getAuthData).mockReturnValue(null);
      vi.mocked(globalThis.fetch).mockResolvedValue(
        new Response('Internal Server Error Text', {
          status: 500,
          statusText: 'Server Error',
        }),
      );

      await expect(httpClient('/api/error')).rejects.toThrow('HTTP Error: 500');
    });
  });
});

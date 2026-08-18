import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: false,
});

// ============================================================================
// Proactive token refresh
// ----------------------------------------------------------------------------
// Keeps the session uninterrupted by exchanging the refresh token for a fresh
// access token shortly BEFORE the current one expires. New tokens are written
// to localStorage; the 401 response interceptor below stays as a fallback so a
// throttled timer can never break a request.
// ============================================================================

const REFRESH_BEFORE_EXPIRY_MS = 60_000; // refresh 1 minute before expiry
const REFRESH_IF_REMAINING_MS = 30_000;  // on tab focus, refresh if under 30s left
const REFRESH_LOCK_KEY = 'token_refresh_lock';
const REFRESH_LOCK_TTL_MS = 3_000;       // cross-tab lock lifetime

let refreshTimer = null;
let refreshPromise = null;

function acquireRefreshLock() {
  try {
    const now = Date.now();
    const holder = localStorage.getItem(REFRESH_LOCK_KEY);
    if (holder && now - Number(holder) < REFRESH_LOCK_TTL_MS) return false;
    localStorage.setItem(REFRESH_LOCK_KEY, String(now));
    return true;
  } catch {
    return true; // storage unavailable — proceed without a lock
  }
}

function releaseRefreshLock() {
  try {
    localStorage.removeItem(REFRESH_LOCK_KEY);
  } catch {
    // ignore
  }
}

function base64UrlDecode(str) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return atob(s);
}

function decodeTokenPayload(token) {
  try {
    const part = token.split('.')[1];
    return JSON.parse(base64UrlDecode(part));
  } catch {
    return null;
  }
}

export function getTokenExpiry(token) {
  const payload = token ? decodeTokenPayload(token) : null;
  return payload && payload.exp ? payload.exp * 1000 : null;
}

/**
 * Single-flight refresh: concurrent callers share one in-flight request so the
 * refresh token is never sent twice at the same time. A cross-tab lock prevents
 * two tabs from rotating the same refresh token simultaneously (rotation makes
 * the old token invalid, so a second concurrent refresh would look like reuse).
 * Resolves with fresh token data, or logs out on failure.
 */
export function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    forceLogout();
    return Promise.reject(new Error('No refresh token available'));
  }

  refreshPromise = (async () => {
    try {
      if (!acquireRefreshLock()) {
        // Another tab is mid-refresh — wait for it, then adopt its tokens.
        await new Promise((resolve) => setTimeout(resolve, REFRESH_LOCK_TTL_MS));
        const adopted = localStorage.getItem('accessToken');
        if (adopted) {
          scheduleTokenRefresh();
          return {
            accessToken: adopted,
            refreshToken: localStorage.getItem('refreshToken'),
          };
        }
      }

      const { data } = await axios.post('/api/auth/refresh', { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      scheduleTokenRefresh();
      return data.data;
    } catch (err) {
      forceLogout();
      throw err;
    } finally {
      releaseRefreshLock();
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * (Re)schedule a proactive refresh so the access token is exchanged just before
 * it expires. Safe to call any time; replaces any pending timer.
 */
export function scheduleTokenRefresh() {
  clearTimeout(refreshTimer);
  refreshTimer = null;

  const token = localStorage.getItem('accessToken');
  const expiry = getTokenExpiry(token);
  if (!token || !expiry) return;

  const remaining = expiry - Date.now();
  if (remaining <= 0) {
    // Already expired/expiring — refresh right away (fire-and-forget).
    refreshAccessToken().catch(() => {});
    return;
  }

  const delay = Math.max(0, remaining - REFRESH_BEFORE_EXPIRY_MS);
  refreshTimer = setTimeout(() => {
    refreshAccessToken().catch(() => {});
  }, delay);
}

function installFocusRefresh() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const check = () => {
    const token = localStorage.getItem('accessToken');
    const expiry = getTokenExpiry(token);
    if (token && expiry && expiry - Date.now() < REFRESH_IF_REMAINING_MS) {
      refreshAccessToken().catch(() => {});
    }
  };
  window.addEventListener('focus', check);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') check();
  });
  // Adopt token rotation performed by another tab and reschedule our timer.
  window.addEventListener('storage', (event) => {
    if (event.key === 'accessToken' || event.key === 'refreshToken') {
      scheduleTokenRefresh();
    }
  });
}

installFocusRefresh();
scheduleTokenRefresh();

// ============================================================================
// Axios interceptors
// ============================================================================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // FormData must NOT force a Content-Type — the browser sets the multipart
  // boundary. JSON requests keep the application/json default.
  if (config.data instanceof FormData) {
    if (typeof config.headers?.delete === 'function') {
      config.headers.delete('Content-Type');
    } else {
      delete config.headers['Content-Type'];
    }
  } else if (!config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    const status = error.response?.status;
    if (status === 401 && !originalRequest._retry) {
      if (originalRequest.url?.includes('/auth/refresh') || originalRequest.url?.includes('/auth/login')) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      try {
        const result = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

function forceLogout() {
  clearTimeout(refreshTimer);
  refreshTimer = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  window.dispatchEvent(new Event('auth:logout'));
}

export const setAuthTokens = ({ accessToken, refreshToken }) => {
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  scheduleTokenRefresh();
};

export const clearAuthTokens = () => {
  clearTimeout(refreshTimer);
  refreshTimer = null;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const getAccessToken = () => localStorage.getItem('accessToken');

export default api;

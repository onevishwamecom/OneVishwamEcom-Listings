import axios from 'axios';
import { auth } from '@/firebase/config';

const DEFAULT_API_URL = import.meta.env.DEV
  ? 'http://localhost:5001/api'
  : 'https://asia-south1-onevishwam.cloudfunctions.net/api';

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  DEFAULT_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  headers: {
    'X-Client-Role': 'lister',
    'X-Account-Type': 'lister',
  },
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

  if (auth?.currentUser) {
    refreshPromise = (async () => {
      try {
        const freshToken = await auth.currentUser.getIdToken(true);
        if (freshToken) {
          localStorage.setItem('accessToken', freshToken);
          scheduleTokenRefresh();
          return { accessToken: freshToken };
        }
      } catch (err) {
        console.warn('Firebase token refresh warning:', err?.message);
      } finally {
        refreshPromise = null;
      }
      return null;
    })();
    return refreshPromise;
  }

  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    return Promise.reject(new Error('No refresh token available'));
  }

  refreshPromise = (async () => {
    try {
      if (!acquireRefreshLock()) {
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

      const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefreshToken } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', newRefreshToken);
      scheduleTokenRefresh();
      return data.data;
    } catch (err) {
      if (err.response?.status === 401) {
        forceLogout();
      }
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

  if (auth?.currentUser) {
    const remaining = expiry ? expiry - Date.now() : 3500_000;
    // Refresh 5 minutes before expiry (or in 10 seconds if already close to expiry)
    const delay = Math.max(10_000, remaining - 5 * 60_000);
    refreshTimer = setTimeout(async () => {
      try {
        if (auth?.currentUser) {
          const fresh = await auth.currentUser.getIdToken(true);
          if (fresh) {
            localStorage.setItem('accessToken', fresh);
          }
        }
      } catch (err) {
        console.warn('Proactive token renewal warning:', err?.message);
      } finally {
        scheduleTokenRefresh();
      }
    }, delay);
    return;
  }

  if (!token || !expiry) return;

  const remaining = expiry - Date.now();
  if (remaining <= 0) {
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

api.interceptors.request.use(async (config) => {
  let token = localStorage.getItem('accessToken');

  if (auth?.currentUser) {
    try {
      const freshToken = await auth.currentUser.getIdToken();
      if (freshToken) {
        token = freshToken;
        localStorage.setItem('accessToken', token);
      }
    } catch {
      // fallback to cached token
    }
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

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
        let freshToken = null;
        if (auth?.currentUser) {
          freshToken = await auth.currentUser.getIdToken(true);
          if (freshToken) {
            localStorage.setItem('accessToken', freshToken);
          }
        } else {
          const result = await refreshAccessToken();
          freshToken = result?.accessToken;
        }

        if (freshToken) {
          originalRequest.headers.Authorization = `Bearer ${freshToken}`;
          return api(originalRequest);
        }
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

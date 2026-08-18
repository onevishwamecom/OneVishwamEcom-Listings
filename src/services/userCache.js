import { CACHE_VERSION, CACHE_TTL } from './cacheService';

/**
 * User-info cache.
 * ============================================================================
 * Stores the non-sensitive profile fields the UI needs, with a cachedAt
 * timestamp and version so stale/incompatible entries are ignored.
 *
 * The `user` key in localStorage is the auth source of truth (managed by the
 * auth slice). This entry is the richer "profile cache" used to hydrate
 * instantly and to avoid calling getUserInfo on every navigation.
 * ============================================================================
 */

const USER_CACHE_KEY = 'onevishwam_user';
const USER_TTL = CACHE_TTL.user;

function readEntry() {
  try {
    const raw = localStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (!entry || entry.version !== CACHE_VERSION) {
      clearCachedUser();
      return null;
    }
    return entry;
  } catch {
    return null;
  }
}

/** Returns the user only if the cache is still within its TTL. */
export function getCachedUser() {
  const entry = readEntry();
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > USER_TTL) return null;
  return entry.user || null;
}

/** Returns the user regardless of age (for stale-while-revalidate display). */
export function getStaleCachedUser() {
  const entry = readEntry();
  return entry ? entry.user || null : null;
}

export function setCachedUser(user) {
  if (!user) return;
  try {
    localStorage.setItem(
      USER_CACHE_KEY,
      JSON.stringify({ user, cachedAt: Date.now(), version: CACHE_VERSION }),
    );
  } catch {
    /* noop */
  }
}

export function clearCachedUser() {
  try {
    localStorage.removeItem(USER_CACHE_KEY);
  } catch {
    /* noop */
  }
}

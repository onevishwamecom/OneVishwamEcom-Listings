import { LRUCache } from '../utils/lruCache';

export const CACHE_VERSION = 1;

export const CACHE_TTL = {
  user: 60 * 60 * 1000, // 1 hour — profile, revalidated on app load
  listings: 10 * 60 * 1000, // 10 minutes — listing lists
  listingDetail: 10 * 60 * 1000, // 10 minutes — single listing
  stats: 5 * 60 * 1000, // 5 minutes — dashboard stats
};

/**
 * CacheService — the single client-side cache used across the app.
 *
 * Design:
 *  - Namespaced keys (prefix + version [+ scope] + key) so cache structures can
 *    be invalidated wholesale by bumping CACHE_VERSION.
 *  - Two storage tiers: an in-memory O(1) LRU Cache for instant reads within a session,
 *    and localStorage so a browser refresh still hydrates instantly.
 *  - TTL + version metadata stored with every entry.
 *  - In-flight promise deduplication: identical concurrent requests share a
 *    single promise (see useCachedData).
 *
 * Use cache.get/cache.set/cache.invalidate from services/hooks only — never
 * access localStorage directly from components.
 */
class CacheService {
  constructor({ prefix = 'onevishwam_cache', version = CACHE_VERSION } = {}) {
    this.prefix = prefix;
    this.version = version;
    this.scope = null;
    this.memory = new LRUCache(250);
    this.inFlight = new Map();
  }

  setScope(scope) {
    this.scope = scope || null;
  }

  getScope() {
    return this.scope;
  }

  buildKey(key) {
    const parts = [this.prefix, this.version];
    if (this.scope) parts.push(this.scope);
    parts.push(key);
    return parts.join('_');
  }

  getEntry(key) {
    const fullKey = this.buildKey(key);
    if (this.memory.has(fullKey)) return this.memory.get(fullKey);
    try {
      const raw = localStorage.getItem(fullKey);
      if (!raw) return null;
      const entry = JSON.parse(raw);
      if (!entry || entry.version !== this.version) {
        this.remove(key);
        return null;
      }
      this.memory.set(fullKey, entry);
      return entry;
    } catch {
      return null;
    }
  }

  set(key, data, { ttl, params } = {}) {
    const fullKey = this.buildKey(key);
    const entry = {
      data,
      cachedAt: Date.now(),
      ttl: ttl || null,
      params: params || null,
      version: this.version,
    };
    this.memory.set(fullKey, entry);
    try {
      localStorage.setItem(fullKey, JSON.stringify(entry));
    } catch {
      // Storage may be full or unavailable — the in-memory copy still works.
    }
  }

  get(key, ttl) {
    const entry = this.getEntry(key);
    if (!entry) return undefined;
    if (this._isExpired(entry, ttl)) return undefined;
    return entry.data;
  }

  getStale(key) {
    const entry = this.getEntry(key);
    return entry ? entry.data : undefined;
  }

  isValid(key, ttl) {
    const entry = this.getEntry(key);
    if (!entry) return false;
    return !this._isExpired(entry, ttl);
  }

  _isExpired(entry, ttl) {
    const maxAge = ttl !== undefined && ttl !== null ? ttl : entry.ttl;
    if (!maxAge) return false;
    return Date.now() - entry.cachedAt > maxAge;
  }

  remove(key) {
    const fullKey = this.buildKey(key);
    this.memory.delete(fullKey);
    try {
      localStorage.removeItem(fullKey);
    } catch {
      /* noop */
    }
  }

  /**
   * Remove every entry whose key matches the given string prefix or RegExp.
   * e.g. cache.invalidate('listing:') clears all single-listing caches.
   */
  invalidate(pattern) {
    const base = [this.prefix, this.version, this.scope].filter(Boolean).join('_');
    const prefixLen = base.length + 1;
    this._allKeys().forEach((fullKey) => {
      const rem = fullKey.startsWith(base + '_') ? fullKey.slice(prefixLen) : fullKey;
      const match =
        typeof pattern === 'string'
          ? rem === pattern || rem.startsWith(`${pattern}_`) || rem.includes(pattern)
          : pattern.test(rem);
      if (match) {
        this.memory.delete(fullKey);
        try {
          localStorage.removeItem(fullKey);
        } catch {
          /* noop */
        }
      }
    });
  }

  clear() {
    this._allKeys().forEach((fullKey) => {
      this.memory.delete(fullKey);
      try {
        localStorage.removeItem(fullKey);
      } catch {
        /* noop */
      }
    });
    this.inFlight.clear();
  }

  clearScoped() {
    if (!this.scope) return;
    const seg = `_${this.scope}_`;
    this._allKeys().forEach((fullKey) => {
      if (fullKey.includes(seg)) {
        this.memory.delete(fullKey);
        try {
          localStorage.removeItem(fullKey);
        } catch {
          /* noop */
        }
      }
    });
  }

  getInFlight(key) {
    return this.inFlight.get(this.buildKey(key)) || null;
  }

  setInFlight(key, promise) {
    this.inFlight.set(this.buildKey(key), promise);
    return promise;
  }

  clearInFlight(key) {
    this.inFlight.delete(this.buildKey(key));
  }

  _allKeys() {
    const keys = new Set(this.memory.keys());
    try {
      for (let i = 0; i < localStorage.length; i += 1) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.prefix)) keys.add(k);
      }
    } catch {
      /* noop */
    }
    return [...keys];
  }
}

export const cache = new CacheService({ prefix: 'onevishwam_cache' });
export default cache;

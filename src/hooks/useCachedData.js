import { useCallback, useEffect, useRef, useState } from 'react';
import cache from '../services/cacheService';

/**
 * useCachedData — stale-while-revalidate data fetching with a client-side
 * cache and in-flight request deduplication.
 *
 * Flow:
 *  - Fresh cache  -> render cached data instantly, NO API call.
 *  - Stale cache  -> render cached data instantly, revalidate in background.
 *  - No cache     -> skeleton (loading), fetch, populate cache.
 *  - Manual refresh() -> bypass cache, refetch, update cache + UI.
 *
 * Concurrent mounts requesting the same key share a single request via
 * cacheService's in-flight map (Part 9 — no duplicate API calls).
 *
 * @param {Function} loader   async function returning the payload
 * @param {string}   cacheKey deterministic cache key for this data
 * @param {Array}    deps     dependencies that re-trigger the request
 * @param {Object}   options  { ttl, fallback }
 */
export default function useCachedData(loader, cacheKey, deps = [], options = {}) {
  const { ttl, fallback = null } = options;

  const [data, setData] = useState(() => cache.getStale(cacheKey) ?? fallback);
  const [loading, setLoading] = useState(() => !cache.isValid(cacheKey, ttl));
  const [error, setError] = useState(null);
  const [revalidating, setRevalidating] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const keyRef = useRef(cacheKey);
  keyRef.current = cacheKey;
  const forceRef = useRef(false);

  const depKey = deps
    .map((d) => (typeof d === 'object' ? JSON.stringify(d) : String(d)))
    .join('|');

  useEffect(() => {
    let cancelled = false;
    const key = keyRef.current;
    const force = forceRef.current;
    forceRef.current = false;

    const entry = cache.getEntry(key);
    if (force) cache.remove(key);
    const fresh = !force && cache.isValid(key, ttl);

    if (fresh) {
      setData(entry.data);
      setLoading(false);
      setError(null);
      return () => {
        cancelled = true;
      };
    }

    const hasCache = !!entry;
    if (!force && hasCache) {
      setData(entry.data);
      setLoading(false);
      setError(null);
    }

    if (force || hasCache) setRevalidating(true);
    else setLoading(true);

    const finish = (result) => {
      cache.set(key, result, { ttl });
      if (cancelled) return;
      setData(result);
      setLoading(false);
      setRevalidating(false);
      setError(null);
    };

    const fail = (err) => {
      if (cancelled) return;
      setLoading(false);
      setRevalidating(false);
      // Keep showing cached data on failure; only surface errors when there
      // was nothing cached to display.
      if (!hasCache && !force) setError(err);
    };

    const inFlight = cache.getInFlight(key);
    if (inFlight) {
      inFlight.then(finish, fail);
    } else {
      const promise = Promise.resolve().then(() => loaderRef.current());
      cache.setInFlight(key, promise);
      promise
        .then((result) => {
          cache.clearInFlight(key);
          finish(result);
        })
        .catch((err) => {
          cache.clearInFlight(key);
          fail(err);
        });
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depKey, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const refresh = useCallback(() => {
    forceRef.current = true;
    setAttempt((n) => n + 1);
  }, []);
  const setDataDirect = useCallback((value) => setData(value), []);

  return {
    data,
    setData: setDataDirect,
    loading,
    error,
    revalidating,
    retry,
    refresh,
  };
}

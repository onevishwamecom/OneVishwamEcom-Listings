import api from './api';
import cache, { CACHE_TTL } from './cacheService';

/**
 * Listings data service — the only place pages touch listing data.
 * ============================================================================
 * Components call fetchListings()/fetchListingById() as loaders passed to
 * useCachedData. The caching layer lives in useCachedData + cacheService, and
 * the raw HTTP calls are de-duplicated here so concurrent loaders share a
 * single request.
 *
 * All requests go through the shared axios client (`services/api.js`), which
 * attaches the auth token and handles refresh on 401.
 * ============================================================================
 */

/** Deduplicate identical concurrent GETs to the same endpoint. */
const inFlight = new Map();

function dedupe(key, fn) {
  if (inFlight.has(key)) return inFlight.get(key);
  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}

function unwrap(response) {
  const body = response?.data;
  return body && body.success !== undefined ? body.data : body;
}

/** Raw flat list from GET /listings?flatten=1 — shared by all listing data. */
export function fetchFlatListings() {
  return dedupe('listings', async () => {
    const items = unwrap(await api.get('/listings', { params: { flatten: '1' } }));
    return Array.isArray(items) ? items : [];
  });
}

/** All listings grouped by `_type` (the shape the stats/list pages expect). */
export async function fetchListings() {
  const items = await fetchFlatListings();
  const grouped = {};
  for (const item of items) {
    const type = item._type || 'properties';
    if (!Array.isArray(grouped[type])) grouped[type] = [];
    grouped[type].push(item);
  }
  return grouped;
}

export async function fetchListingById(id) {
  const items = await fetchFlatListings();
  const found = items.find((item) => item._id === id || item.id === id);
  if (!found) throw new Error('Listing not found');
  return found;
}

export async function findListing(type, id) {
  const body = unwrap(await api.get(`/listings/${type}/${encodeURIComponent(id)}`));
  const item = body?.item || body;
  if (!item) throw new Error('Listing not found');
  return item;
}

export async function createListing(payload) {
  return unwrap(await api.post('/listings', payload));
}

export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return unwrap(await api.post('/upload/images', formData));
}

export async function updateListing(type, id, updates) {
  return unwrap(await api.patch(`/listings/${type}/${encodeURIComponent(id)}`, updates));
}

export async function deleteListing(type, id) {
  return unwrap(await api.delete(`/listings/${type}/${encodeURIComponent(id)}`));
}

/**
 * Drop every cache entry that is derived from listing data so the next visit
 * refetches. Call after any mutation (create / edit / delete listing).
 */
export function invalidateListings() {
  cache.invalidate('listings');
  cache.invalidate('stats');
  cache.invalidate('listing:');
}

export { CACHE_TTL };

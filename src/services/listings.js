import api, { getAccessToken } from './api';
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

// Clear any stale local listing entries stored during offline testing
try {
  localStorage.removeItem('user_created_listings');
  cache.clear();
} catch {}

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
  // If no auth token is available (e.g. after logout or unauthenticated), do NOT call the API
  if (!getAccessToken()) {
    return Promise.resolve([]);
  }

  return dedupe('listings', async () => {
    if (!getAccessToken()) return [];
    const items = unwrap(await api.get('/listings', { params: { flatten: '1' } }));
    const validItems = Array.isArray(items) ? items : [];
    return validItems.filter((item) => {
      const id = String(item._id || item.id || '');
      return !id.startsWith('local_');
    });
  });
}

/** All listings grouped by `_type` (the shape the stats/list pages expect). */
export async function fetchListings() {
  if (!getAccessToken()) return {};
  const items = await fetchFlatListings();
  const grouped = {};
  for (const item of items) {
    const type = item._type || 'properties';
    if (!Array.isArray(grouped[type])) grouped[type] = [];
    grouped[type].push(item);
  }
  return grouped;
}

export async function fetchListingById(id, typeHint) {
  if (!getAccessToken()) throw new Error('Not authenticated');
  const cleanId = String(id || '').trim();
  if (cleanId.startsWith('local_')) {
    throw new Error('Listing not found');
  }
  const items = await fetchFlatListings();
  const found = items.find((item) => String(item._id) === cleanId || String(item.id) === cleanId);
  if (found) return found;

  // Direct backend fallback across known modules
  const candidateTypes = [typeHint, 'properties', 'vehicle', 'grocery', 'garment', 'jewellery'].filter(Boolean);
  for (const t of candidateTypes) {
    try {
      const item = await findListing(t, cleanId);
      if (item) return { ...item, _type: t };
    } catch {
      // try next candidate
    }
  }

  throw new Error('Listing not found');
}

export async function findListing(type, id) {
  if (String(id).startsWith('local_')) {
    throw new Error('Listing not found');
  }
  const body = unwrap(await api.get(`/listings/${type}/${encodeURIComponent(id)}`));
  const item = body?.item || body;
  if (!item) throw new Error('Listing not found');
  return item;
}

export async function createListing(payload) {
  const resp = await api.post('/listings', payload);
  const unwrapped = unwrap(resp);
  const created = unwrapped?.item || unwrapped;
  invalidateListings();
  return created;
}

export async function bulkUploadListings(formData) {
  const resp = await api.post('/listings/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  invalidateListings();
  return resp.data;
}

export async function recordTemplateDownloadLog(data) {
  try {
    const resp = await api.post('/bulk-listing/download-log', data);
    return unwrap(resp);
  } catch (err) {
    try {
      const resp = await api.post('/listings/bulk/download-log', data);
      return unwrap(resp);
    } catch {
      return null;
    }
  }
}

export async function fetchBulkBatches(params = {}) {
  try {
    const resp = await api.get('/bulk-listing/batches', { params });
    return unwrap(resp) || [];
  } catch (err) {
    const resp = await api.get('/listings/bulk/batches', { params });
    return unwrap(resp) || [];
  }
}

export async function fetchBulkBatchById(batchId) {
  try {
    const resp = await api.get(`/bulk-listing/batches/${encodeURIComponent(batchId)}`);
    return unwrap(resp);
  } catch (err) {
    const resp = await api.get(`/listings/bulk/batches/${encodeURIComponent(batchId)}`);
    return unwrap(resp);
  }
}

export async function addItemToBatch(batchId, itemData) {
  const resp = await api.post(`/bulk-listing/batches/${encodeURIComponent(batchId)}/items`, itemData);
  invalidateListings();
  return unwrap(resp);
}

export async function updateBatchItem(batchId, itemId, updates) {
  const resp = await api.put(`/bulk-listing/batches/${encodeURIComponent(batchId)}/items/${encodeURIComponent(itemId)}`, updates);
  invalidateListings();
  return unwrap(resp);
}

export async function deleteBatchItem(batchId, itemId) {
  const resp = await api.delete(`/bulk-listing/batches/${encodeURIComponent(batchId)}/items/${encodeURIComponent(itemId)}`);
  invalidateListings();
  return unwrap(resp);
}

export async function deleteBatch(batchId) {
  const resp = await api.delete(`/bulk-listing/batches/${encodeURIComponent(batchId)}`);
  invalidateListings();
  return unwrap(resp);
}

export async function uploadImages(files) {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return unwrap(await api.post('/upload/images', formData));
}

export async function uploadBrochure(file) {
  const formData = new FormData();
  formData.append('brochure', file);
  return unwrap(await api.post('/upload/brochure', formData));
}

export async function uploadVideo(file) {
  const formData = new FormData();
  formData.append('video', file);
  return unwrap(await api.post('/upload/video', formData));
}

export async function updateListing(type, id, updates) {
  const resp = await api.patch(`/listings/${type}/${encodeURIComponent(id)}`, updates);
  const unwrapped = unwrap(resp);
  const updated = unwrapped?.item || unwrapped;
  invalidateListings();
  return updated;
}

export async function deleteListing(type, id) {
  if (String(id).startsWith('local_')) {
    invalidateListings();
    return true;
  }
  await api.delete(`/listings/${type}/${encodeURIComponent(id)}`);
  invalidateListings();
  return true;
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

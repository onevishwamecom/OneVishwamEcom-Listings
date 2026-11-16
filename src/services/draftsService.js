import { getCachedUser } from './userCache';

const DRAFTS_KEY_PREFIX = 'OneVishwam_listing_drafts_';

function getUserDraftsKey() {
  try {
    const user = getCachedUser() || {};
    const identifier = user.email || user.id || user._id || 'global';
    return `${DRAFTS_KEY_PREFIX}${identifier}`;
  } catch {
    return `${DRAFTS_KEY_PREFIX}global`;
  }
}

/**
 * Get all saved drafts for current user.
 */
export function getSavedDrafts() {
  try {
    const key = getUserDraftsKey();
    const raw = localStorage.getItem(key);
    if (!raw) {
      // Check legacy single-draft key for migration
      const legacyRaw = localStorage.getItem('OneVishwam_listing_draft');
      if (legacyRaw) {
        try {
          const parsed = JSON.parse(legacyRaw);
          const migratedDraft = {
            _id: `draft_${Date.now()}`,
            id: `draft_${Date.now()}`,
            status: 'draft',
            title: parsed.form?.title || parsed.form?.brand || 'Untitled Draft',
            category: parsed.category || 'properties',
            _type: parsed.category || 'properties',
            subcategory: parsed.subcategory || parsed.form?.subcategory || '',
            price: parsed.form?.price || '',
            images: parsed.photos || [],
            photos: parsed.photos || [],
            documents: parsed.documents || [],
            brochure: parsed.brochure || null,
            form: parsed.form || {},
            step: parsed.step || 1,
            savedAt: parsed.savedAt || Date.now(),
            updatedAt: new Date(parsed.savedAt || Date.now()).toISOString(),
          };
          localStorage.removeItem('OneVishwam_listing_draft');
          localStorage.setItem(key, JSON.stringify([migratedDraft]));
          return [migratedDraft];
        } catch {
          localStorage.removeItem('OneVishwam_listing_draft');
        }
      }
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to retrieve drafts:', err);
    return [];
  }
}

/**
 * Get draft by draft ID.
 */
export function getDraftById(draftId) {
  if (!draftId) return null;
  const drafts = getSavedDrafts();
  return drafts.find((d) => String(d._id) === String(draftId) || String(d.id) === String(draftId)) || null;
}

/**
 * Save or update a draft.
 */
export function saveDraft(draftData) {
  try {
    const key = getUserDraftsKey();
    const drafts = getSavedDrafts();
    const draftId = draftData._id || draftData.id || `draft_${Date.now()}`;
    const cleanDraft = {
      ...draftData,
      _id: draftId,
      id: draftId,
      status: 'draft',
      updatedAt: new Date().toISOString(),
      savedAt: draftData.savedAt || Date.now(),
    };

    const existingIndex = drafts.findIndex(
      (d) => String(d._id) === String(draftId) || String(d.id) === String(draftId)
    );

    let updatedDrafts;
    if (existingIndex >= 0) {
      updatedDrafts = [...drafts];
      updatedDrafts[existingIndex] = cleanDraft;
    } else {
      updatedDrafts = [cleanDraft, ...drafts];
    }

    localStorage.setItem(key, JSON.stringify(updatedDrafts));
    window.dispatchEvent(new Event('onevishwam_drafts_updated'));
    return cleanDraft;
  } catch (err) {
    console.error('Failed to save draft:', err);
    throw err;
  }
}

/**
 * Delete a draft by ID.
 */
export function deleteDraft(draftId) {
  try {
    const key = getUserDraftsKey();
    const drafts = getSavedDrafts();
    const filtered = drafts.filter(
      (d) => String(d._id) !== String(draftId) && String(d.id) !== String(draftId)
    );
    localStorage.setItem(key, JSON.stringify(filtered));
    window.dispatchEvent(new Event('onevishwam_drafts_updated'));
    return true;
  } catch (err) {
    console.error('Failed to delete draft:', err);
    return false;
  }
}

import { getCachedUser } from './userCache';
import { fetchFlatListings } from './listings';

/**
 * Notifications service — derived from real listing data.
 * ============================================================================
 * Notifications are computed from the logged-in vendor's own listings
 * (matched by contact number) returned by GET /listings?flatten=1, so there
 * is no separate notifications store. Read/unread is derived from the listing
 * status, with an in-memory (session-only) override for "mark as read".
 * ============================================================================
 */

const CHANGE_EVENT = 'OneVishwam:notifications-change';

const TYPE_META = {
  APPROVED: { icon: 'fa-circle-check', gradient: 'from-brand-blue to-brand-blue/70' },
  CHANGES_REQUIRED: { icon: 'fa-pen-to-square', gradient: 'from-brand-orange to-brand-orange/70' },
  SUBMITTED: { icon: 'fa-paper-plane', gradient: 'from-brand-gold to-brand-gold/70' },
  RESUBMITTED: { icon: 'fa-rotate-left', gradient: 'from-brand-gold to-brand-orange' },
  CANCELLED: { icon: 'fa-ban', gradient: 'from-rose-500 to-rose-500/70' },
};

const readOverrides = new Set();

function toTenDigits(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 0) return 'Just now';
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 2) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years === 1 ? '' : 's'} ago`;
}

function buildNotification(item) {
  const status = item.status || 'pending';
  const resubmitted = item.updatedAt && item.createdAt && item.updatedAt > item.createdAt;
  const title = item.title || item.name || item.brand || 'Listing';
  const id = item._id || item.id;

  let type;
  let titleText;
  let message;
  let read;

  if (status === 'approved') {
    type = 'APPROVED';
    titleText = 'Listing Approved';
    message = `Your "${title}" listing has been approved and is now live.`;
    read = true;
  } else if (status === 'changes-required') {
    type = 'CHANGES_REQUIRED';
    titleText = 'Changes Required';
    message = item.adminComment
      ? `Your "${title}" listing requires changes: ${item.adminComment}`
      : `Your "${title}" listing requires changes. Please review the admin feedback.`;
    read = false;
  } else if (status === 'cancelled') {
    type = 'CANCELLED';
    titleText = 'Listing Cancelled';
    message = item.adminComment
      ? `Your "${title}" listing was cancelled: ${item.adminComment}`
      : `Your "${title}" listing was cancelled.`;
    read = false;
  } else if (resubmitted) {
    type = 'RESUBMITTED';
    titleText = 'Listing Resubmitted';
    message = `Your updated "${title}" listing has been submitted for admin review.`;
    read = true;
  } else {
    type = 'SUBMITTED';
    titleText = 'Listing Submitted';
    message = `Your "${title}" listing has been submitted for admin review.`;
    read = true;
  }

  return {
    id,
    type,
    title: titleText,
    message,
    time: timeAgo(item.updatedAt || item.createdAt),
    read: read || readOverrides.has(id),
    icon: TYPE_META[type].icon,
    gradient: TYPE_META[type].gradient,
    listingId: id,
  };
}

export async function fetchNotifications() {
  const [user, items] = await Promise.all([getCachedUser(), fetchFlatListings()]);
  if (!user) return [];
  const myMobile = toTenDigits(user.mobile || user.phone || user.contact);
  if (myMobile.length !== 10) return [];
  return items
    .filter((item) => toTenDigits(item.contact) === myMobile)
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .map(buildNotification);
}

export async function getUnreadCount() {
  const list = await fetchNotifications();
  return list.filter((n) => !n.read).length;
}

export function markNotificationRead(id) {
  if (id) readOverrides.add(id);
  emitChange();
}

export function markAllNotificationsRead(list) {
  (Array.isArray(list) ? list : []).forEach((n) => readOverrides.add(n.id));
  emitChange();
}

export function subscribeNotifications(listener) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener(CHANGE_EVENT, listener);
  return () => window.removeEventListener(CHANGE_EVENT, listener);
}

function emitChange() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  }
}

import { getCategoryConfig, getCategoryFields as getDeclaredCategoryFields } from '../../config/listingConfig';

export function getCategoryInfo(listing) {
  const type = listing._type || listing.category || '';
  return getCategoryConfig(type);
}

export function getSubcategory(listing) {
  if (listing.subcategory) return listing.subcategory;
  if (listing.propertyType) return listing.propertyType;
  if (listing.bodyType) return listing.bodyType;
  if (listing.wheelerType) return listing.wheelerType;
  if (listing.category) return listing.category;
  return '—';
}

export function getLocationDetails(listing) {
  return {
    state: listing.state || 'Karnataka',
    district: listing.district || 'Bengaluru Urban',
    city: listing.city || 'bengaluru',
    area: listing.area || '—',
    mapUrl: listing.mapUrl || listing.details?.mapUrl || '',
  };
}

export function getPriceType(listing) {
  if (listing.priceType) return listing.priceType;
  if (listing.priceSuffix === '/ Per Month' || listing.priceSuffix === '/ Per Year') return 'rent';
  if (listing.priceSuffix === 'Negotiable') return 'negotiable';
  return 'fixed';
}

export function getPriceTypeLabel(type) {
  const labels = {
    fixed: 'Fixed Price',
    negotiable: 'Negotiable',
    rent: 'Rent / Lease',
    'per-month': 'Per Month',
    'per-year': 'Per Year',
    'on-request': 'Price on Request',
  };
  return labels[type] || labels.fixed;
}

export function getCategoryFields(listing) {
  return getDeclaredCategoryFields(listing);
}

export function getAdminFeedback(listing, ADMIN_FEEDBACKS = {}) {
  if (listing.status === 'changes-required') {
    return listing.adminComment || ADMIN_FEEDBACKS[listing._id] || 'Please review and update the listing as per admin feedback.';
  }
  return null;
}

export function getTimeline(listing, getFeedbackFn) {
  const base = [
    { date: listing.createdAt, title: 'Listing Created', description: 'Listing submitted for review', type: 'created' },
  ];

  if (listing.status === 'approved') {
    base.push({ date: listing.updatedAt || listing.createdAt, title: 'Listing Approved', description: 'Approved by admin and now live', type: 'approved' });
  } else if (listing.status === 'changes-required') {
    base.push({ date: listing.updatedAt || listing.createdAt, title: 'Changes Required', description: typeof getFeedbackFn === 'function' ? getFeedbackFn(listing) : 'Changes requested by admin', type: 'changes' });
  } else if (listing.status === 'cancelled') {
    base.push({ date: listing.updatedAt || listing.createdAt, title: 'Listing Cancelled', description: listing.adminComment || 'Cancelled by admin', type: 'cancelled' });
  }

  return base;
}
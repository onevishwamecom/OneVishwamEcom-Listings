export { SERVICE_CONFIG, PRIMARY_CATEGORIES, normalizeCategoryKey } from '../../config/listingConfig';

export const STATUS_TABS = [
  { id: 'all', label: 'All' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'changes-required', label: 'Changes Required' },
  { id: 'cancelled', label: 'Cancelled' },
];

export { STATUS_BADGE } from '../../config/listingConfig';

export const PRICE_LIMITS = Object.freeze({ min: 0, max: 100000000 });

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name (A-Z)' },
];

export const EMPTY_STATE = {
  all: {
    icon: 'fa-box-open',
    title: 'No listings yet',
    subtitle: 'Start by listing your first product.',
    showCta: true,
  },
  pending: {
    icon: 'fa-hourglass-half',
    title: 'No pending listings',
    subtitle: "You don't have any listings waiting for approval.",
    showCta: true,
  },
  approved: {
    icon: 'fa-circle-check',
    title: 'No approved listings yet',
    subtitle: 'Approved listings that are live will appear here.',
    showCta: false,
  },
  'changes-required': {
    icon: 'fa-pen-to-square',
    title: 'No changes required',
    subtitle: 'Listings that need edits before approval will appear here.',
    showCta: false,
  },
  cancelled: {
    icon: 'fa-circle-xmark',
    title: 'No cancelled listings',
    subtitle: 'Listings that have been cancelled will appear here.',
    showCta: false,
  },
};

export const parsePrice = (item) => {
  const raw = item?.priceValue || item?.price;
  return parseFloat(String(raw).replace(/[₹,\s]/g, '')) || 0;
};
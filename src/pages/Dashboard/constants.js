import { PRIMARY_CATEGORIES } from '../../config/listingConfig';

const EXTRA_TILES = {
  requirements: { icon: 'fa-clipboard-list', gradient: 'from-slate-400 to-slate-600', label: 'Requirements' },
  wishlist: { icon: 'fa-heart', gradient: 'from-brand-orange to-brand-orange/70', label: 'Wishlist' },
};

export const TYPE_CONFIG = Object.fromEntries(
  PRIMARY_CATEGORIES.map((cat) => [cat.id, { icon: cat.icon, gradient: cat.gradient, label: cat.label }])
);

Object.assign(TYPE_CONFIG, EXTRA_TILES);
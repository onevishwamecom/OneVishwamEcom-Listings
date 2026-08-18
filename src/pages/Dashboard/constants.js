import { getCategoryConfig } from '../../config/listingConfig';

const EXTRA_TILES = {
  requirements: { icon: 'fa-clipboard-list', gradient: 'from-slate-400 to-slate-600', label: 'Requirements' },
  wishlist: { icon: 'fa-heart', gradient: 'from-brand-orange to-brand-orange/70', label: 'Wishlist' },
};

const SHARED_TYPES = ['properties', 'vehicles', 'groceries', 'garments', 'jewellery', 'finance'];

export const TYPE_CONFIG = Object.fromEntries(
  SHARED_TYPES.map((type) => {
    const cfg = getCategoryConfig(type);
    return [type, { icon: cfg.icon, gradient: cfg.gradient, label: cfg.label }];
  }),
);

Object.assign(TYPE_CONFIG, EXTRA_TILES);
export const SERVICE_CONFIG = {
  properties: {
    label: 'Real Estate',
    icon: 'fa-house-chimney',
    color: 'bg-brand-blue/10 text-brand-blue border-brand-blue/25',
    gradient: 'from-brand-blue to-brand-blue/70',
  },
  vehicles: {
    label: 'Vehicles',
    icon: 'fa-car',
    color: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
    gradient: 'from-brand-gold to-brand-gold/70',
  },
  groceries: {
    label: 'Groceries',
    icon: 'fa-basket-shopping',
    color: 'bg-brand-orange/10 text-brand-orange border-brand-orange/25',
    gradient: 'from-brand-orange to-brand-orange/70',
  },
  garments: {
    label: 'Garments',
    icon: 'fa-shirt',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    gradient: 'from-slate-400 to-slate-500',
  },
  jewellery: {
    label: 'Jewellery',
    icon: 'fa-gem',
    color: 'bg-brand-blue/10 text-brand-blue border-brand-blue/25',
    gradient: 'from-brand-blue to-brand-blue/60',
  },
  finance: {
    label: 'Finance',
    icon: 'fa-building-columns',
    color: 'bg-brand-gold/15 text-brand-gold border-brand-gold/30',
    gradient: 'from-brand-gold to-brand-orange',
  },
  services: {
    label: 'Services',
    icon: 'fa-wrench',
    color: 'bg-slate-100 text-slate-600 border-slate-200',
    gradient: 'from-slate-500 to-gray-500',
  },
};

export const STATUS_BADGE = {
  pending: { variant: 'pending', icon: 'fa-clock', label: 'Pending Approval' },
  approved: { variant: 'blue', icon: 'fa-circle-check', label: 'Approved' },
  'changes-required': { variant: 'warning', icon: 'fa-pen-to-square', label: 'Changes Required' },
  cancelled: { variant: 'danger', icon: 'fa-circle-xmark', label: 'Cancelled' },
  rejected: { variant: 'danger', icon: 'fa-circle-xmark', label: 'Cancelled' },
};

export function getCategoryConfig(type, fallback = SERVICE_CONFIG.properties) {
  return SERVICE_CONFIG[type] || fallback;
}
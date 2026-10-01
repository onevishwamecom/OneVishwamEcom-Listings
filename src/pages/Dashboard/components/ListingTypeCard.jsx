import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { TYPE_CONFIG } from '../constants';

export function ListingTypeCard({ type, count, index }) {
  const config = TYPE_CONFIG[type] || { icon: 'fa-cube', gradient: 'from-slate-500 to-gray-500', label: type };

  return (
    <Link
      key={type}
      to="/listings"
      className="group bg-white rounded-2xl border border-slate-200/70 p-3.5 shadow-sm hover:shadow-md transition-all duration-200 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-3">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 shrink-0`}>
          <i className={`fa-solid ${config.icon} text-sm`} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-500 truncate">{config.label}</p>
          <p className="text-lg font-extrabold text-slate-900 tracking-tight">{count}</p>
        </div>
        <i className="fa-solid fa-chevron-right text-xs text-slate-300 group-hover:text-brand-blue group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
      </div>
    </Link>
  );
}

export function ListingTypeSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/70 p-3.5 shadow-xs">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-5 w-10" />
        </div>
      </div>
    </div>
  );
}

export function EmptyStateCard() {
  return (
    <div className="text-center py-10 bg-white rounded-2xl border border-slate-200/70 shadow-xs">
      <div className="w-12 h-12 rounded-2xl bg-brand-blue/10 flex items-center justify-center mx-auto mb-3">
        <i className="fa-solid fa-inbox text-xl text-brand-blue" aria-hidden="true" />
      </div>
      <p className="text-base font-bold text-slate-800 mb-1">No listings yet</p>
      <p className="text-xs text-slate-400 mb-4">Start by posting your first product listing</p>
      <Link
        to="/add-listing"
        className="inline-flex items-center gap-2 bg-brand-gold text-brand-navy px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-gold/90 transition-all duration-150"
      >
        <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
        List New Product
      </Link>
    </div>
  );
}
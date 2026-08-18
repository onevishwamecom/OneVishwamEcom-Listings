import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/Skeleton';
import { TYPE_CONFIG } from '../constants';

export function ListingTypeCard({ type, count, index }) {
  const config = TYPE_CONFIG[type] || { icon: 'fa-cube', gradient: 'from-slate-500 to-gray-500', label: type };

  return (
    <Link
      key={type}
      to="/listings"
      className="group bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover hover-lift opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3`}>
          <i className={`fa-solid ${config.icon} text-lg`} aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">{config.label}</p>
          <p className="text-2xl font-extrabold text-slate-900">{count}</p>
        </div>
        <i className="fa-solid fa-arrow-right text-slate-300 ml-auto opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden="true" />
      </div>
    </Link>
  );
}

export function ListingTypeSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-6 w-12" />
        </div>
      </div>
    </div>
  );
}

export function EmptyStateCard() {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 shadow-card">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center mx-auto mb-4">
        <i className="fa-solid fa-inbox text-2xl text-brand-blue" aria-hidden="true" />
      </div>
      <p className="text-lg font-semibold text-slate-700 mb-1">No listings yet</p>
      <p className="text-sm text-slate-400 mb-6">Start by posting your first listing</p>
      <Link
        to="/add-listing"
        className="inline-flex items-center gap-2 bg-brand-gold text-brand-navy px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-gold/90 hover:shadow-glow-gold transition-all duration-200 hover:scale-[1.02]"
      >
        <i className="fa-solid fa-plus text-xs" aria-hidden="true" />
        List New Product
      </Link>
    </div>
  );
}
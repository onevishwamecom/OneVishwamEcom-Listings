import React from 'react';
import { Link } from 'react-router-dom';
import LottieFeedbackAnimation from '@/components/ui/LottieFeedbackAnimation';

export default function ListingNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 text-center animate-fade-in">
      <div className="w-full max-w-sm mx-auto mb-4 flex items-center justify-center">
        <LottieFeedbackAnimation
          type="notFound404"
          size="lg"
          fallbackIcon="fa-solid fa-triangle-exclamation"
          style={{ width: '100%', height: 'auto', maxHeight: '240px' }}
        />
      </div>

      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
        <i className="fa-solid fa-circle-exclamation text-[10px]" />
        Portal Page Not Found
      </span>

      <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
        Page Not Found in Listing Portal
      </h2>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
        The listing portal page you are trying to visit does not exist or has been moved.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-navy text-white text-xs font-bold hover:bg-slate-800 shadow-sm transition-all"
        >
          <i className="fa-solid fa-gauge text-xs" />
          Dashboard
        </Link>
        <Link
          to="/listings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all shadow-xs"
        >
          <i className="fa-solid fa-list text-xs" />
          View All Listings
        </Link>
      </div>
    </div>
  );
}

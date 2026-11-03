import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Reusable ListerIdentityCard displaying authenticated lister name, status, and bulk upload shortcut.
 */
export function ListerIdentityCard({
  displayName = 'One Vishwam',
  category = 'properties',
  categoryLabel = 'Properties',
  categoryBadge = 'Verified Partner',
  isOneVishwam = false,
  isEditing = false,
}) {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-brand-navy rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-blue/20 to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center text-brand-gold text-lg shrink-0">
            <i className="fa-solid fa-building-shield" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-tight text-white">
                {displayName}
              </span>
              <span className="inline-flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                <i className="fa-solid fa-circle-check text-[9px]" /> Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isOneVishwam ? 'In-House Official Platform Listing' : 'Authorized Marketplace Lister Account'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing && (
            <Link
              to={`/bulk-listing/${category}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-all shadow-xs"
            >
              <i className="fa-solid fa-file-excel text-emerald-400 text-xs" />
              <span>Bulk Excel</span>
            </Link>
          )}
          <span className="text-[11px] font-bold text-slate-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
            {categoryBadge || categoryLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ListerIdentityCard;

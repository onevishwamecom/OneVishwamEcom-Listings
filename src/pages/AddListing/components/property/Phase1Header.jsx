import React from 'react';

export const PROPERTY_TYPES = [
  {
    id: 'Residential',
    label: 'Residential',
    icon: 'fa-house',
  },
  {
    id: 'Flat/Villa',
    label: 'Flat / Villa',
    icon: 'fa-building',
  },
  {
    id: 'Independent House',
    label: 'Independent House',
    icon: 'fa-house-chimney-window',
  },
  {
    id: 'Agricultural',
    label: 'Agricultural',
    icon: 'fa-wheat-awn',
  },
  {
    id: 'Commercial',
    label: 'Commercial',
    icon: 'fa-shop',
  },
  {
    id: 'Plot/Land',
    label: 'Plot / Land',
    icon: 'fa-map-location-dot',
  },
  {
    id: 'Industrial',
    label: 'Industrial',
    icon: 'fa-industry',
  },
];

export default function Phase1Header({
  vendorName = '',
  channelPartnerName = '',
  propertyType = 'Residential',
  onChange,
  errors = {},
  isOneVishwam = false,
  user = {},
}) {
  const displayName = isOneVishwam
    ? 'One Vishwam'
    : (channelPartnerName || vendorName || user?.fullName || user?.name || user?.partnerName || user?.email || 'Authenticated Lister');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Clean Effortless Identity Card */}
      <div className="bg-gradient-to-r from-slate-900 to-brand-navy rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-brand-blue/20 to-transparent pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black shadow-inner shrink-0 ${
              isOneVishwam 
                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30' 
                : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
            }`}>
              <i className={`fa-solid ${isOneVishwam ? 'fa-crown text-amber-400' : 'fa-user-check text-blue-400'}`} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Listing Identity
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isOneVishwam
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                    : 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                }`}>
                  {isOneVishwam ? 'One Vishwam (In-House)' : 'Verified Lister Account'}
                </span>
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
                {displayName}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 self-start sm:self-auto">
            <i className="fa-solid fa-circle-check text-emerald-400 text-xs" />
            <span>Auto-linked from auth session — no manual entry needed</span>
          </div>
        </div>
      </div>

      {/* Balanced Equal Property Category Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Select Property Category</h3>
          {errors.propertyType && (
            <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
              Selection required
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {PROPERTY_TYPES.map((type) => {
            const isSelected = propertyType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => onChange('propertyType', type.id)}
                className={`relative flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-150 cursor-pointer h-[72px] group ${
                  isSelected
                    ? 'border-2 border-brand-blue bg-blue-50/50 shadow-xs'
                    : 'border border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                }`}
              >
                {/* Icon container */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-brand-blue text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}
                >
                  <i className={`fa-solid ${type.icon}`} />
                </div>

                {/* Title */}
                <div className="min-w-0 flex-1 pr-6">
                  <span
                    className={`text-xs sm:text-sm font-semibold truncate block transition-colors ${
                      isSelected ? 'text-brand-blue font-bold' : 'text-slate-800'
                    }`}
                  >
                    {type.label}
                  </span>
                </div>

                {/* Active checkmark indicator */}
                <div className="absolute top-3 right-3">
                  {isSelected ? (
                    <div className="w-5 h-5 rounded-full bg-brand-blue text-white flex items-center justify-center text-[10px] shadow-xs">
                      <i className="fa-solid fa-check" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-200 bg-white group-hover:border-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

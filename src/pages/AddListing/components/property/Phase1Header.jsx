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
  isPartnerLocked = false,
  partnerBadge = '',
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Compact Identity Fields */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Vendor Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Vendor / Builder / Owner Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-building text-xs" />
              </div>
              <input
                type="text"
                value={vendorName}
                onChange={(e) => onChange('vendorName', e.target.value)}
                placeholder="e.g. Prestige Group / Ramesh Kumar"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                  errors.vendorName
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
                }`}
              />
            </div>
            {errors.vendorName && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.vendorName}</p>
            )}
          </div>

          {/* Channel Partner Name */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Channel Partner Name <span className="text-red-500">*</span>
              </label>
              {isPartnerLocked && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <i className="fa-solid fa-lock text-[9px]" />
                  <span>{partnerBadge || 'Verified Partner Identity'}</span>
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <i className={`fa-solid ${isPartnerLocked ? 'fa-shield-halved text-emerald-600' : 'fa-user-check'} text-xs`} />
              </div>
              <input
                type="text"
                readOnly={isPartnerLocked}
                disabled={isPartnerLocked}
                value={channelPartnerName}
                onChange={(e) => {
                  if (!isPartnerLocked) onChange('channelPartnerName', e.target.value);
                }}
                placeholder="e.g. OneVishwam Associate / Rajesh Sharma"
                className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border text-xs outline-none transition-all ${
                  isPartnerLocked
                    ? 'bg-slate-100 text-slate-600 cursor-not-allowed border-slate-300 font-medium select-none shadow-none'
                    : errors.channelPartnerName
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 bg-white'
                    : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300 bg-white'
                }`}
              />
            </div>
            {isPartnerLocked ? (
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <i className="fa-solid fa-circle-info text-[10px]" />
                <span>Locked to your authenticated partner account</span>
              </p>
            ) : errors.channelPartnerName ? (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.channelPartnerName}</p>
            ) : null}
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

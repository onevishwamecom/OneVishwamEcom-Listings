import React from 'react';
import { Link } from 'react-router-dom';
import ListerIdentityCard from '../shared/ListerIdentityCard';

export const PROPERTY_TYPES = [
  { id: 'Residential', label: 'Residential', icon: 'fa-house' },
  { id: 'Flat/Villa', label: 'Flat / Villa', icon: 'fa-building' },
  { id: 'Independent House', label: 'Independent House', icon: 'fa-house-chimney-window' },
  { id: 'Agricultural', label: 'Agricultural', icon: 'fa-wheat-awn' },
  { id: 'Commercial', label: 'Commercial', icon: 'fa-shop' },
  { id: 'Plot/Land', label: 'Plot / Land', icon: 'fa-map-location-dot' },
  { id: 'Industrial', label: 'Industrial', icon: 'fa-industry' },
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
    : channelPartnerName || vendorName || user?.name || 'Verified Lister';

  return (
    <div className="space-y-6 animate-fade-in">
      <ListerIdentityCard
        displayName={displayName}
        category="properties"
        categoryLabel="Properties"
        categoryBadge="Real Estate Portal"
        isOneVishwam={isOneVishwam}
      />

      {/* Property Category Selection */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-house-chimney text-brand-blue" />
            <span>Select Property Classification</span>
            <span className="text-red-500">*</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Select the exact property type to load tailored specifications and approvals
          </p>
        </div>

        {errors.propertyType && (
          <p className="text-xs font-semibold text-red-500">{errors.propertyType}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {PROPERTY_TYPES.map((pt) => {
            const isSelected = propertyType === pt.id;
            return (
              <button
                key={pt.id}
                type="button"
                onClick={() => onChange?.('propertyType', pt.id)}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'border-brand-blue bg-blue-50/70 text-brand-blue ring-2 ring-brand-blue/20 shadow-xs'
                    : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 text-sm transition-transform ${
                    isSelected ? 'bg-brand-blue text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  <i className={`fa-solid ${pt.icon}`} />
                </div>
                <span className="text-xs font-bold leading-tight">{pt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

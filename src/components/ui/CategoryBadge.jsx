import React from 'react';
import { SERVICE_CONFIG, normalizeCategoryKey } from '@/config/listingConfig';

export const CATEGORY_CONFIG = SERVICE_CONFIG;

/**
 * Reusable CategoryBadge with icon box and label matching design system.
 * Dynamically resolves icons, colors, and labels from the unified category registry.
 */
export function CategoryBadge({
  category = 'properties',
  label,
  icon,
  className = '',
  showIconBox = true,
  cfgMap,
}) {
  const normalized = normalizeCategoryKey(category);
  const cfg = cfgMap?.[normalized] || cfgMap?.[category] || SERVICE_CONFIG[normalized] || SERVICE_CONFIG[category] || {
    label: label || category || 'General',
    icon: icon || 'fa-box-open',
    color: 'bg-blue-50 text-brand-blue border-blue-100',
  };

  const displayLabel = label || cfg.label;
  const displayIcon = icon || cfg.icon;

  if (!showIconBox) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${cfg.color} ${className}`}
      >
        <i className={`fa-solid ${displayIcon} text-[11px]`} />
        <span>{displayLabel}</span>
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 whitespace-nowrap ${className}`}>
      <span
        className={`w-7 h-7 rounded-lg border flex items-center justify-center ${cfg.color} shrink-0`}
      >
        <i className={`fa-solid ${displayIcon} text-[11px]`} />
      </span>
      <span className="text-xs font-semibold text-slate-700">{displayLabel}</span>
    </div>
  );
}

export default CategoryBadge;

import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, formatINR } from '@/utils';
import StatusPill from './StatusPill';

export function ListingCard({
  item,
  detailUrl,
  editUrl,
  onEdit,
  onDelete,
  isBusy = false,
}) {
  if (!item) return null;

  const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : item.image ? [item.image] : [];
  const img = images[0];
  const title = item.title || item.name || item.brand || 'Untitled Product';
  const loc = [item.area, item.city].filter(Boolean).join(', ') || item.location || item.city || item.area || 'Location not specified';
  const category = (item._type || item.category || 'properties').toLowerCase();
  const subcategory = item.propertyType || item.subcategory || (category === 'properties' ? 'FLAT' : category.toUpperCase());

  // Category Icon Resolver
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'properties':
      case 'property':
        return 'fa-house-chimney';
      case 'vehicles':
      case 'automobile':
        return 'fa-car';
      case 'electronics':
        return 'fa-laptop';
      case 'fashion':
        return 'fa-shirt';
      case 'jewellery':
        return 'fa-gem';
      default:
        return 'fa-box-open';
    }
  };

  // Specification pills derived dynamically
  const specs = [];
  if (item.bhk) specs.push({ icon: 'fa-bed', text: item.bhk.includes('BHK') ? item.bhk : `${item.bhk} BHK`, variant: 'slate' });
  if (item.area_sqft || item.area) {
    const areaVal = item.area_sqft || item.area;
    specs.push({
      icon: 'fa-ruler-combined',
      text: String(areaVal).toLowerCase().includes('sq') ? areaVal : `${areaVal} Sq.ft`,
      variant: 'slate',
    });
  }
  if (item.totalUnits) {
    specs.push({
      icon: 'fa-building',
      text: String(item.totalUnits).toLowerCase().includes('unit') ? item.totalUnits : `${item.totalUnits} Units`,
      variant: 'emerald',
    });
  }
  if (item.acres) {
    specs.push({
      icon: 'fa-vector-square',
      text: `${item.acres} Acres`,
      variant: 'emerald',
    });
  }
  if (item.loanApproved === 'Yes' || item.bankApproved) {
    specs.push({
      icon: 'fa-building-columns',
      text: 'Bank Approved',
      variant: 'blue',
    });
  }

  // Fallback specs if none found (e.g. for non-property products)
  if (specs.length === 0 && item.price) {
    specs.push({
      icon: 'fa-tag',
      text: formatINR(item.numericPrice || item.priceValue || item.price),
      variant: 'blue',
    });
  }

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-brand-blue/40 overflow-hidden shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col h-full">
      {/* ── Image Container (Compact 16:9) ── */}
      <div className="relative overflow-hidden bg-slate-100 aspect-[16/9] shrink-0">
        {img ? (
          <img
            src={img}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
            <i className={`fa-solid ${getCategoryIcon(category)} text-3xl mb-1 text-slate-300`} />
            <span className="text-[11px] font-semibold text-slate-400">No Image</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Top-Left Badges */}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1 z-10 pointer-events-none">
          <span className="rounded-md px-2 py-0.5 text-[10px] font-black tracking-wide shadow-2xs flex items-center gap-1 bg-emerald-600 text-white">
            <i className="fa-solid fa-bolt text-amber-300 text-[9px]" />
            New
          </span>
          {item.status && item.status !== 'approved' && (
            <StatusPill status={item.status} size="xs" />
          )}
        </div>

        {/* Top-Right Quick Action Buttons (Edit & Delete) */}
        <div className="absolute right-2.5 top-2.5 z-10 flex items-center gap-1">
          {onEdit ? (
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="w-7 h-7 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-brand-blue shadow-2xs flex items-center justify-center text-[10px] transition-colors cursor-pointer"
              title="Edit listing"
              aria-label="Edit listing"
            >
              <i className="fa-solid fa-pen text-[10px]" />
            </button>
          ) : editUrl ? (
            <Link
              to={editUrl}
              className="w-7 h-7 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-brand-blue shadow-2xs flex items-center justify-center text-[10px] transition-colors cursor-pointer"
              title="Edit listing"
              aria-label="Edit listing"
            >
              <i className="fa-solid fa-pen text-[10px]" />
            </Link>
          ) : null}

          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(item)}
              disabled={isBusy}
              className="w-7 h-7 rounded-full bg-white/95 hover:bg-rose-50 text-slate-700 hover:text-rose-600 shadow-2xs flex items-center justify-center text-[10px] transition-colors cursor-pointer disabled:opacity-40"
              title="Delete listing"
              aria-label="Delete listing"
            >
              {isBusy ? (
                <i className="fa-solid fa-spinner fa-spin text-[10px]" />
              ) : (
                <i className="fa-solid fa-trash text-[10px]" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Card Body (Compact Spacing) ── */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 gap-1.5">
        {/* Category Pill & Date */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 border border-blue-200/60 text-[10px] font-black uppercase tracking-wider text-brand-blue">
            <i className={`fa-solid ${getCategoryIcon(category)} text-[9px]`} />
            <span>{subcategory}</span>
          </span>

          {item.createdAt && (
            <span className="text-[10px] font-medium text-slate-400">
              {formatDate(item.createdAt)}
            </span>
          )}
        </div>

        {/* Title */}
        <Link
          to={detailUrl}
          className="font-bold text-slate-900 text-sm leading-snug line-clamp-1 group-hover:text-brand-blue transition-colors mt-0.5"
          title={title}
        >
          {title}
        </Link>

        {/* Location */}
        {loc && (
          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-500 min-w-0">
            <i className="fa-solid fa-location-dot text-brand-blue text-[10px] shrink-0" />
            <span className="truncate">{loc}</span>
          </div>
        )}

        {/* Specification Tags */}
        {specs.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            {specs.slice(0, 3).map((spec, i) => (
              <span
                key={i}
                className={`font-semibold text-[10px] rounded-md px-1.5 py-0.5 inline-flex items-center gap-1 ${
                  spec.variant === 'emerald'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                    : spec.variant === 'blue'
                    ? 'bg-blue-50 text-brand-blue border border-blue-200/60 font-bold'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                <i className={`fa-solid ${spec.icon} text-[9px] text-brand-blue shrink-0`} />
                <span className="truncate max-w-[120px]">{spec.text}</span>
              </span>
            ))}
          </div>
        )}

        {/* ── Card Footer: Full-Width 1-Line Action Button ── */}
        <div className="mt-auto pt-2.5 border-t border-slate-100">
          <Link
            to={detailUrl}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#90dafc] hover:bg-[#78d0f8] text-[#020617] px-4 py-2 text-xs font-black transition-all shadow-2xs hover:shadow-xs border border-[#70caf5] active:scale-[0.98] cursor-pointer whitespace-nowrap"
          >
            <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            <span>Manage Listing</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;

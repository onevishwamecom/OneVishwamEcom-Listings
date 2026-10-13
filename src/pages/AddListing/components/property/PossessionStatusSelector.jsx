import React from 'react';

/**
 * PossessionStatusSelector
 * Provides a 1-click toggle and select dropdown tailored dynamically to property type:
 * - Plot / Land: 'Ready for Registration' vs 'Under Construction'
 * - Flat / Villa / Structural: 'Ready to Occupy' vs 'Under Construction'
 */
export default function PossessionStatusSelector({
  propertyType = '',
  value = '',
  onChange,
  error = '',
  label = 'Possession Status',
  required = true,
}) {
  const normType = String(propertyType || '').toLowerCase();
  const isPlot = normType.includes('plot') || normType.includes('land') || normType.includes('agricultural');

  // Ternary condition matching user instruction:
  // Plot -> 'Ready for Registration', Structural -> 'Ready to Occupy'
  const readyLabel = isPlot ? 'Ready for Registration' : 'Ready to Occupy';
  const underConstructionLabel = 'Under Construction';

  const isReady =
    value === readyLabel ||
    value === 'Ready for Registration' ||
    value === 'Ready to Occupy' ||
    value === 'Ready to Move In' ||
    value === 'Ready to Move';

  const isUnderConstruction = value === 'Under Construction' || String(value || '').toLowerCase().includes('construction');

  const dropdownOptions = isPlot
    ? ['Ready for Registration', 'Under Construction']
    : ['Ready to Occupy', 'Under Construction', 'Ready to Move In', 'Resale'];

  const handleSelect = (status) => {
    onChange?.(status);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {value && (
          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            Selected: <strong className="text-slate-800">{value}</strong>
          </span>
        )}
      </div>

      {/* Quick 1-Click Toggle */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => handleSelect(readyLabel)}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
            isReady
              ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-base transition-colors ${
              isReady ? 'bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <i className="fa-solid fa-circle-check" />
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-bold leading-tight ${isReady ? 'text-emerald-900' : 'text-slate-800'}`}>
              {readyLabel}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {isPlot ? 'Immediate registration ready' : 'Completed & ready to occupy'}
            </p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleSelect(underConstructionLabel)}
          className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
            isUnderConstruction
              ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20 shadow-xs'
              : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-base transition-colors ${
              isUnderConstruction ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <i className="fa-solid fa-person-digging" />
          </div>
          <div className="min-w-0">
            <p className={`text-xs font-bold leading-tight ${isUnderConstruction ? 'text-amber-900' : 'text-slate-800'}`}>
              Under Construction
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Work / development in progress
            </p>
          </div>
        </button>
      </div>

      {/* Dropdown for explicit selection */}
      <div className="relative pt-1">
        <select
          value={value || ''}
          onChange={(e) => handleSelect(e.target.value)}
          className={`w-full appearance-none px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all pr-8 ${
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
              : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
          }`}
        >
          <option value="">Select Possession Status</option>
          {dropdownOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
          {value && !dropdownOptions.includes(value) && (
            <option value={value}>{value}</option>
          )}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
          <i className="fa-solid fa-chevron-down text-[10px]" />
        </div>
      </div>

      {error && <p className="text-[11px] font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
}

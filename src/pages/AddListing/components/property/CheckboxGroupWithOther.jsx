import React, { useState } from 'react';

/**
 * Modern Interactive Tag Chip Checkbox Group with automatic "Other" write-in.
 * - Displays multi-select options as compact, elegant clickable badge chips.
 * - Checked items display an active blue fill with checkmark badge.
 * - Dynamic "Other" chip reveals an inline write-in input below.
 */
export default function CheckboxGroupWithOther({
  label,
  subtext,
  options = [],
  values = [],
  onChange,
  required = false,
  error,
  otherPlaceholder = 'Specify other amenities/utilities...',
  columns = '',
}) {
  const currentList = Array.isArray(values) ? values : [];
  const predefinedSelected = currentList.filter((v) => options.includes(v) && v !== 'Other');
  const customItems = currentList.filter((v) => !options.includes(v) && v !== 'Other');

  const [hasOtherChecked, setHasOtherChecked] = useState(
    currentList.includes('Other') || customItems.length > 0
  );
  const [customText, setCustomText] = useState(customItems.join(', '));

  const toggleOption = (opt) => {
    if (opt === 'Other') {
      const nextChecked = !hasOtherChecked;
      setHasOtherChecked(nextChecked);
      if (!nextChecked) {
        setCustomText('');
        onChange(predefinedSelected);
      } else {
        onChange([...predefinedSelected, customText.trim() || 'Other']);
      }
      return;
    }

    if (currentList.includes(opt)) {
      const next = currentList.filter((item) => item !== opt);
      onChange(next);
    } else {
      onChange([...currentList, opt]);
    }
  };

  const handleCustomTextChange = (e) => {
    const text = e.target.value;
    setCustomText(text);

    const customArray = text
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const base = currentList.filter((item) => options.includes(item) && item !== 'Other');
    if (customArray.length > 0) {
      onChange([...base, ...customArray]);
    } else {
      onChange([...base, 'Other']);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {subtext && <span className="text-[11px] text-slate-400 font-normal">{subtext}</span>}
      </div>

      <div
        className={
          columns
            ? `grid ${columns} gap-2`
            : 'flex flex-wrap gap-2'
        }
      >
        {options.map((opt) => {
          const isSelected =
            opt === 'Other'
              ? hasOtherChecked
              : currentList.includes(opt);

          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggleOption(opt)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-xs ring-1 ring-brand-blue/30 font-bold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'border-brand-blue bg-brand-blue text-white shadow-xs'
                    : 'border-slate-300 bg-white text-transparent'
                }`}
              >
                <i className="fa-solid fa-check text-[9px]" />
              </span>
              <span>{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Render inline write-in text field when "Other" is checked */}
      {options.includes('Other') && hasOtherChecked && (
        <div className="pt-1.5 animate-fade-in relative max-w-lg">
          <input
            type="text"
            value={customText}
            onChange={handleCustomTextChange}
            placeholder={otherPlaceholder}
            autoFocus
            className={`w-full px-3.5 py-2 rounded-lg border text-xs bg-blue-50/20 text-slate-800 placeholder-slate-400 outline-none transition-all ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                : 'border-brand-blue/60 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15'
            }`}
          />
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
}

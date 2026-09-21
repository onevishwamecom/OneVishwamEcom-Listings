import React, { useState, useEffect } from 'react';

/**
 * Modern Segmented Pill & Chip Radio Group with automatic "Other" write-in.
 * - Detects Yes/No binary options and renders them as sleek segmented pill buttons.
 * - Multi-choice options (Facing, Authorities, BHK, etc.) render as compact, high-contrast chips.
 * - Smooth inline write-in reveals when "Other" is selected.
 */
export default function RadioGroupWithOther({
  label,
  subtext,
  name,
  options = [],
  value = '',
  onChange,
  required = false,
  error,
  otherPlaceholder = 'Please specify...',
  columns = '',
}) {
  const isPredefined = options.includes(value);
  const isOtherSelected = value !== '' && (!isPredefined || value === 'Other');

  // Track custom write-in text if value is not in predefined list
  const [customText, setCustomText] = useState(
    !isPredefined && value && value !== 'Other' ? value : ''
  );

  useEffect(() => {
    if (!isPredefined && value && value !== 'Other') {
      setCustomText(value);
    } else if (isPredefined && value !== 'Other') {
      setCustomText('');
    }
  }, [value, isPredefined]);

  const handleSelectOption = (opt) => {
    if (opt === 'Other') {
      onChange(customText.trim() ? customText : 'Other');
    } else {
      onChange(opt);
    }
  };

  const handleCustomTextChange = (e) => {
    const text = e.target.value;
    setCustomText(text);
    onChange(text);
  };

  // Check if this is a binary Yes/No or Yes/No/Other set
  const isBinarySet =
    options.length <= 3 &&
    options.includes('Yes') &&
    options.includes('No');

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {subtext && <span className="text-[11px] text-slate-400 font-normal">{subtext}</span>}
      </div>

      {isBinarySet ? (
        /* Sleek Segmented Pill Control for Binary Yes/No */
        <div className="inline-flex p-1 bg-slate-100 rounded-lg border border-slate-200 gap-1">
          {options.map((opt) => {
            const isSelected = opt === 'Other' ? isOtherSelected : value === opt;
            const isYes = opt === 'Yes';
            const isNo = opt === 'No';

            let activeClass = 'bg-white text-slate-900 shadow-xs border border-slate-200 font-semibold';
            if (isSelected) {
              if (isYes) {
                activeClass = 'bg-brand-blue text-white shadow-xs font-bold';
              } else if (isNo) {
                activeClass = 'bg-slate-800 text-white shadow-xs font-bold';
              } else {
                activeClass = 'bg-brand-blue text-white shadow-xs font-bold';
              }
            } else {
              activeClass = 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium';
            }

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md text-xs transition-all duration-150 cursor-pointer ${activeClass}`}
              >
                {isSelected && (
                  <i
                    className={`fa-solid ${
                      isYes ? 'fa-check' : isNo ? 'fa-xmark' : 'fa-pen'
                    } text-[10px]`}
                  />
                )}
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      ) : (
        /* Compact Badge Chips for Multi-choice Options */
        <div
          className={
            columns
              ? `grid ${columns} gap-2`
              : 'flex flex-wrap gap-2'
          }
        >
          {options.map((opt) => {
            const isSelected = opt === 'Other' ? isOtherSelected : value === opt;

            return (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className={`inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'border-brand-blue bg-blue-50 text-brand-blue shadow-xs ring-1 ring-brand-blue/30 font-bold'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-brand-blue bg-brand-blue text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isSelected && <span className="w-1 h-1 rounded-full bg-white" />}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Dynamic Write-in Input for "Other" */}
      {isOtherSelected && (
        <div className="pt-1.5 animate-fade-in">
          <div className="relative">
            <input
              type="text"
              value={customText}
              onChange={handleCustomTextChange}
              placeholder={otherPlaceholder}
              autoFocus
              className="w-full pl-3.5 pr-8 py-2 rounded-lg border border-brand-blue/60 bg-blue-50/20 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-blue/15"
            />
          </div>
        </div>
      )}

      {error && <p className="text-xs font-medium text-red-500 mt-1">{error}</p>}
    </div>
  );
}

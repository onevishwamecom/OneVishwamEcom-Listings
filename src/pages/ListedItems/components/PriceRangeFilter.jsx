import { useEffect, useRef, useState } from 'react';
import { PRICE_LIMITS } from '../constants';

const KEY_STEP = 10000;
const OVERLAP_PCT = 2.5;
const span = PRICE_LIMITS.max - PRICE_LIMITS.min;

const clamp01 = (v) => Math.min(1, Math.max(0, v));

function groupDigits(n) {
  const s = String(Math.trunc(n));
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  const rest = s.slice(0, -3);
  return `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',')},${last3}`;
}

function PriceInput({ label, value, onChange }) {
  const [draft, setDraft] = useState(groupDigits(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setDraft(groupDigits(value));
  }, [value, focused]);

  const handleChange = (e) => {
    const digits = e.target.value.replace(/[^\d]/g, '');
    if (!digits) {
      setDraft('');
      return;
    }
    const raw = Number(digits);
    if (!Number.isFinite(raw)) return;
    const clamped = Math.min(PRICE_LIMITS.max, Math.max(PRICE_LIMITS.min, raw));
    setDraft(groupDigits(clamped));
    onChange(clamped);
  };

  return (
    <div className="relative">
      <span
        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-slate-400 text-sm font-bold"
        aria-hidden="true"
      >
        ₹
      </span>
      <input
        type="text"
        inputMode="numeric"
        value={draft}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={label}
        placeholder={label}
        className="w-full rounded-2xl border bg-slate-50/50 pl-8 pr-3 py-3 text-sm font-semibold text-slate-800 outline-none transition-all duration-200 border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
      />
    </div>
  );
}

export default function PriceRangeFilter({ value, onChange, onClear }) {
  const trackRef = useRef(null);
  const [activeThumb, setActiveThumb] = useState(null);

  const toPct = (v) => ((v - PRICE_LIMITS.min) / span) * 100;
  const minPct = toPct(value.min);
  const maxPct = toPct(value.max);
  const isActive = value.min !== PRICE_LIMITS.min || value.max !== PRICE_LIMITS.max;

  const [dMin, dMax] =
    maxPct - minPct < OVERLAP_PCT
      ? [Math.max(0, maxPct - OVERLAP_PCT), Math.min(100, minPct + OVERLAP_PCT)]
      : [minPct, maxPct];

  const valueFromX = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return value.max;
    const ratio = clamp01((clientX - rect.left) / rect.width);
    return Math.round(PRICE_LIMITS.min + ratio * span);
  };

  const commit = (minVal, maxVal) => {
    let m = Math.min(PRICE_LIMITS.max, Math.max(PRICE_LIMITS.min, minVal));
    let M = Math.min(PRICE_LIMITS.max, Math.max(PRICE_LIMITS.min, maxVal));
    if (m > M) m = M;
    if (m === value.min && M === value.max) return;
    onChange({ min: m, max: M });
  };

  const grab = (e, which) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveThumb(which);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  };

  const drag = (e) => {
    if (!activeThumb) return;
    const v = valueFromX(e.clientX);
    commit(activeThumb === 'min' ? v : value.min, activeThumb === 'max' ? v : value.max);
  };

  const release = (e) => {
    setActiveThumb(null);
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
  };

  const jump = (e) => {
    if (e.target.closest?.('[data-thumb]')) return;
    const v = valueFromX(e.clientX);
    if (Math.abs(v - value.min) <= Math.abs(v - value.max)) commit(v, value.max);
    else commit(value.min, v);
  };

  const nudge = (which, dir) => {
    commit(which === 'min' ? value.min + dir * KEY_STEP : value.min, which === 'max' ? value.max + dir * KEY_STEP : value.max);
  };

  const thumbs = [
    { which: 'min', pct: dMin, v: value.min, label: 'Minimum price', valueMax: value.max },
    { which: 'max', pct: dMax, v: value.max, label: 'Maximum price', valueMax: PRICE_LIMITS.max },
  ];

  return (
    <section className="rounded-2xl border border-slate-100 bg-slate-50/30 p-4" aria-label="Filter by price range">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue text-sm">
            <i className="fa-solid fa-indian-rupee-sign" aria-hidden="true" />
          </span>
          <h3 className="text-sm font-bold text-slate-800">Price Range</h3>
        </div>
        {isActive && (
          <button
            onClick={onClear}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-800 transition-colors"
          >
            <i className="fa-solid fa-rotate-left text-[10px]" aria-hidden="true" /> Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-[minmax(0,200px)_1fr_minmax(0,200px)] lg:items-center">
        <PriceInput label="Min price" value={value.min} onChange={(v) => commit(v, value.max)} />
        <PriceInput label="Max price" value={value.max} onChange={(v) => commit(value.min, v)} />

        <div
          ref={trackRef}
          onPointerDown={jump}
          className="relative col-span-2 flex h-11 items-center select-none touch-none cursor-pointer lg:col-span-1"
        >
          <div className="absolute inset-x-0 h-1.5 rounded-full bg-slate-200" />
          <div
            className="absolute h-1.5 rounded-full bg-brand-blue"
            style={{ left: `${Math.min(dMin, dMax)}%`, right: `${100 - Math.max(dMin, dMax)}%` }}
          />
          {thumbs.map(({ which, pct, v, label, valueMax }) => (
            <div
              key={which}
              data-thumb
              role="slider"
              tabIndex={0}
              aria-label={label}
              aria-valuemin={PRICE_LIMITS.min}
              aria-valuemax={valueMax}
              aria-valuenow={v}
              onPointerDown={(e) => grab(e, which)}
              onPointerMove={drag}
              onPointerUp={release}
              onPointerCancel={release}
              onKeyDown={(e) => {
                const dir =
                  e.key === 'ArrowRight' || e.key === 'ArrowUp'
                    ? 1
                    : e.key === 'ArrowLeft' || e.key === 'ArrowDown'
                      ? -1
                      : 0;
                if (dir) {
                  e.preventDefault();
                  nudge(which, dir);
                }
              }}
              style={{ left: `${pct}%`, transform: 'translate(-50%, -50%)' }}
              className={`absolute top-1/2 h-6 w-6 rounded-full bg-white border-[3px] border-brand-blue shadow-md cursor-grab active:cursor-grabbing focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/30 touch-none ${activeThumb === which ? 'z-30' : 'z-20'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
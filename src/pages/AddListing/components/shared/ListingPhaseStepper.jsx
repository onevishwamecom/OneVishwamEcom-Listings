import React from 'react';

/**
 * Reusable 3-phase horizontal step progress bar with step jump and completion state.
 */
export function ListingPhaseStepper({
  phases = [
    { step: 1, title: 'Partner & Category' },
    { step: 2, title: 'Specifications' },
    { step: 3, title: 'Media & Approvals' },
  ],
  activePhase = 1,
  onStepJump,
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
      <div className="flex items-center justify-between">
        {phases.map((p, idx) => {
          const isActive = p.step === activePhase;
          const isCompleted = p.step < activePhase;
          const isClickable = p.step <= activePhase || typeof onStepJump === 'function';

          return (
            <React.Fragment key={p.step}>
              <button
                type="button"
                onClick={() => onStepJump?.(p.step)}
                disabled={!isClickable}
                className={`flex items-center gap-2.5 transition-colors group ${
                  isClickable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-brand-blue text-white ring-4 ring-blue-100 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {isCompleted ? <i className="fa-solid fa-check text-[10px]" /> : p.step}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline transition-colors ${
                    isActive ? 'text-brand-blue font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  Step {p.step}: {p.title}
                </span>
                <span
                  className={`text-xs font-semibold sm:hidden transition-colors ${
                    isActive ? 'text-brand-blue font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {p.title}
                </span>
              </button>

              {idx < phases.length - 1 && (
                <div className="flex-1 mx-3 sm:mx-6 h-0.5 bg-slate-100">
                  <div
                    className={`h-full transition-all duration-300 ${
                      p.step < activePhase ? 'bg-emerald-500 w-full' : 'bg-transparent w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default ListingPhaseStepper;

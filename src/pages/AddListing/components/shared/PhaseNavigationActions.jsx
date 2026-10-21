import React from 'react';

/**
 * Reusable navigation and submit action bar for multi-phase listing forms.
 */
export function PhaseNavigationActions({
  activePhase = 1,
  totalPhases = 3,
  onPrev,
  onNext,
  onSubmit,
  onCancel,
  onSaveDraft,
  submitting = false,
  submitError = null,
  isEditing = false,
}) {
  return (
    <div className="space-y-3 pt-2">
      {submitError && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-red-500" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activePhase === 1 ? (
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <button
              type="button"
              onClick={onPrev}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-arrow-left text-[10px]" /> Back
            </button>
          )}

          {typeof onSaveDraft === 'function' && !isEditing && (
            <button
              type="button"
              onClick={onSaveDraft}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Save Draft
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {activePhase < totalPhases ? (
            <button
              type="button"
              onClick={onNext}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue/90 text-white text-xs font-extrabold shadow-sm hover:shadow transition-all cursor-pointer"
            >
              <span>Continue to Step {activePhase + 1}</span>
              <i className="fa-solid fa-arrow-right text-[10px]" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={onSubmit}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                  <span>Submitting Listing...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane text-xs" />
                  <span>{isEditing ? 'Save Changes & Resubmit' : 'Submit for Admin Approval'}</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PhaseNavigationActions;

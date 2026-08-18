import Badge from "@/components/ui/Badge";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import PageContainer from "@/components/ui/PageContainer";
import { STEPS, REQUIRED_BY_STEP } from "./formConfig";
import { CategoryStep } from "./components/CategoryStep";
import { BasicInfoStep } from "./components/BasicInfoStep";
import { DetailsStep } from "./components/DetailsStep";
import { LocationStep } from "./components/LocationStep";
import { PricingStep } from "./components/PricingStep";
import { MediaStep } from "./components/MediaStep";
import { ReviewStep } from "./components/ReviewStep";
import { useAddListingForm } from "./useAddListingForm";

export default function AddListing() {
  const {
    // State
    step,
    form,
    photos,
    documents,
    brochure,
    setBrochure,
    brochureUrl,
    setBrochureUrl,
    submitted,
    submitting,
    submitError,
    loadError,
    loading,
    showConfirm,
    validationErrors,
    isEditing,
    isLastStep,
    category,
    subcategory,
    catFields,
    imageUrls,
    docUrls,
    originalListingId,
    adminFeedback,
    // Refs
    fileRef,
    brochureRef,
    documentRef,
    dragOver,
    docDragOver,
    // Handlers
    updateForm,
    handleAddPhoto,
    handleAddDocument,
    removePhoto,
    removeDocument,
    handleSaveDraft,
    handlePublish,
    handleConfirmSubmit,
    handleNext,
    handleBack,
    formatINR,
    setStep,
    setShowConfirm,
    setDragOver,
    setDocDragOver,
    canNext,
  } = useAddListingForm();

  const canProceed = () => canNext(form, step, catFields, imageUrls, STEPS, REQUIRED_BY_STEP);

  const setCategory = (value) => updateForm("category", value);

  if (submitted) {
    const listingId = originalListingId || `LST${Date.now().toString().slice(-6)}`;
    const isResubmission = isEditing && originalListingId;
    return (
      <div className="max-w-2xl mx-auto text-center py-16 animate-fade-in-up">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-20 rounded-full" />
          <div className="relative w-28 h-28 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center mx-auto shadow-float text-white border-4 border-white">
            <i className="fa-solid fa-check text-5xl" />
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          {isResubmission ? "Listing Resubmitted!" : isEditing ? "Listing Updated!" : "Listing Submitted for Approval!"}
        </h2>

        <p className="text-lg text-slate-500 font-medium mb-6 max-w-md mx-auto">
          {isResubmission
            ? "Your updated listing has been sent for admin approval."
            : isEditing
            ? "Your listing changes have been saved and sent for review."
            : "Your listing has been submitted and is now pending admin approval."}
        </p>

        <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100 inline-block min-w-[280px]">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 mb-2">
            <i className="fa-solid fa-clock text-brand-gold" /> Status
          </div>
          <Badge variant="pending" icon="fa-clock" className="text-base px-4 py-2">
            Pending Approval
          </Badge>
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Listing ID</div>
            <div className="font-mono text-lg font-extrabold text-brand-blue">{listingId}</div>
          </div>
        </div>

        {brochureUrl && (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm transition-all"
          >
            <i className="fa-solid fa-file-pdf text-red-500 text-lg" />
            View Uploaded Brochure
          </a>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/listings?status=pending"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-base hover:shadow-glow-blue transition-all duration-300 hover:-translate-y-1"
          >
            <i className="fa-solid fa-list" /> View Pending Listings
          </Link>
          {!isEditing && (
            <button
              onClick={() => {
                window.location.href = "/add-listing";
              }}
              className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-8 py-4 rounded-2xl font-bold text-base hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 hover:-translate-y-1"
            >
              <i className="fa-solid fa-plus" /> Add Another
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <PageContainer className="pb-12">
      {isEditing && (
        <div className="mb-6 rounded-2xl bg-blue-50 border border-blue-100 p-4 text-sm font-medium text-blue-700 flex items-center gap-3 animate-fade-in shadow-sm">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-pen" aria-hidden="true" />
          </div>
          <span>
            <strong>Editing mode active</strong> — your changes will overwrite this existing listing.
          </span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-12 text-center" aria-live="polite">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-blue mb-4" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Loading Listing Data...</p>
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-3xl shadow-card border border-slate-100 p-12 text-center">
          <div className="h-16 w-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-triangle-exclamation text-2xl text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Failed to load</h3>
          <p className="text-slate-500 mb-6">{loadError}</p>
          <Link to="/listings" className="text-brand-blue font-bold hover:underline">
            Go back to my listings
          </Link>
        </div>
      ) : (
        <>
          <PageHeader
            title={isEditing ? "Edit Listing" : "List New Product"}
            subtitle={isEditing
              ? "Update the details and save your changes"
              : "Add your product details and submit the listing for admin approval"}
            action={
              <Link
                to="/listings"
                className="inline-flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                <i className="fa-solid fa-arrow-left" /> Back to Listed Items
              </Link>
            }
          />

          <div className="bg-white rounded-3xl shadow-card border border-slate-100 overflow-hidden">
            <div className="bg-slate-50/50 border-b border-slate-100 px-6 py-5">
              <div className="flex items-center justify-between relative z-10">
                {STEPS.map((s, i) => {
                  const isActive = i === step;
                  const isCompleted = i < step;
                  const isClickable = i <= step;

                  return (
                    <div key={s.id} className="flex flex-col items-center gap-2 relative z-10 flex-1">
                      <button
                        onClick={() => isClickable && setStep(i)}
                        disabled={!isClickable}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${
                          isActive
                            ? "bg-brand-blue text-white shadow-glow-blue scale-110 ring-4 ring-brand-blue/10"
                            : isCompleted
                            ? "bg-brand-gold text-brand-navy cursor-pointer hover:bg-brand-gold/90 shadow-sm"
                            : "bg-white text-slate-300 border-2 border-slate-200 cursor-not-allowed"
                        }`}
                      >
                        {isCompleted ? (
                          <i className="fa-solid fa-check" />
                        ) : (
                          <i className={`fa-solid ${s.icon}`} />
                        )}
                      </button>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                          isActive
                            ? "text-brand-blue"
                            : isCompleted
                            ? "text-brand-gold"
                            : "text-slate-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                  );
                })}
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0 rounded-full">
                  <div
                    className="h-full bg-brand-blue transition-all duration-500 ease-in-out rounded-full shadow-[0_0_8px_rgba(72,150,230,0.5)]"
                    style={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-10">
              {step === 0 && (
                <CategoryStep
                  category={category}
                  setCategory={setCategory}
                  isEditing={isEditing}
                />
              )}

              {step === 1 && (
                <BasicInfoStep
                  form={form}
                  updateForm={updateForm}
                  validationErrors={validationErrors}
                />
              )}

              {step === 2 && (
                <DetailsStep
                  form={form}
                  updateForm={updateForm}
                  category={category}
                  catFields={catFields}
                  validationErrors={validationErrors}
                />
              )}

              {step === 3 && (
                <LocationStep
                  form={form}
                  updateForm={updateForm}
                  validationErrors={validationErrors}
                />
              )}

              {step === 4 && (
                <PricingStep
                  form={form}
                  updateForm={updateForm}
                  validationErrors={validationErrors}
                  formatINR={formatINR}
                />
              )}

              {step === 5 && (
                <MediaStep
                  photos={photos}
                  documents={documents}
                  brochure={brochure}
                  setBrochure={setBrochure}
                  brochureUrl={brochureUrl}
                  setBrochureUrl={setBrochureUrl}
                  fileRef={fileRef}
                  brochureRef={brochureRef}
                  documentRef={documentRef}
                  dragOver={dragOver}
                  setDragOver={setDragOver}
                  docDragOver={docDragOver}
                  setDocDragOver={setDocDragOver}
                  handleAddPhoto={handleAddPhoto}
                  handleAddDocument={handleAddDocument}
                  removePhoto={removePhoto}
                  removeDocument={removeDocument}
                  validationErrors={validationErrors}
                />
              )}

              {step === 6 && (
                <ReviewStep
                  form={form}
                  category={category}
                  subcategory={subcategory}
                  catFields={catFields}
                  brochure={brochure}
                  brochureUrl={brochureUrl}
                  imageUrls={imageUrls}
                  docUrls={docUrls}
                  documents={documents}
                  setStep={setStep}
                  isEditing={isEditing}
                  formatINR={formatINR}
                  adminFeedback={adminFeedback}
                />
              )}

              {submitError && (
                <div className="mt-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-sm font-medium text-red-600 flex items-center gap-3 animate-fade-in">
                  <i className="fa-solid fa-circle-exclamation text-lg" />
                  {submitError}
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-brand-blue rounded-xl hover:bg-brand-blue/10 transition-colors"
                  >
                    <i className="fa-solid fa-arrow-left" /> Back
                  </button>
                ) : (
                  <div />
                )}

                {!isLastStep ? (
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-glow-blue hover:bg-brand-blue/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                  >
                    Next Step <i className="fa-solid fa-arrow-right" />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={handleSaveDraft}
                      disabled={submitting}
                      className="hidden sm:inline-flex items-center gap-2 border-2 border-brand-blue text-brand-blue px-6 py-3.5 rounded-2xl text-sm font-bold hover:bg-brand-blue/5 hover:border-brand-blue/70 transition-all disabled:opacity-50"
                    >
                      <i className="fa-solid fa-floppy-disk text-slate-400" /> Save Draft
                    </button>
                    <button
                      onClick={handlePublish}
                      disabled={submitting}
                      className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-8 py-3.5 rounded-2xl text-sm font-bold shadow-glow-gold hover:bg-brand-gold/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      {submitting ? (
                        <i className="fa-solid fa-circle-notch fa-spin text-sm" />
                      ) : (
                        <i className="fa-solid fa-paper-plane text-sm" />
                      )}
                      {submitting
                        ? isEditing
                          ? "Saving..."
                          : "Submitting..."
                        : isEditing
                        ? "Save Changes"
                        : "Submit for Approval"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showConfirm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 animate-fade-in">
              <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6 animate-scale-in">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-brand-gold/15 flex items-center justify-center mx-auto mb-4">
                    <i className="fa-solid fa-circle-question text-3xl text-brand-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {isEditing && originalListingId ? "Resubmit Listing?" : "Submit Listing?"}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {isEditing && originalListingId
                      ? "Your changes will be sent to the admin for another review. The listing will return to Pending Approval."
                      : "Your listing will be sent for admin review after submission. You can still edit it from the Pending tab if changes are needed."}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 bg-white text-slate-700 border-2 border-slate-200 py-3.5 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmSubmit}
                    disabled={submitting}
                    className="flex-1 bg-brand-gold text-brand-navy py-3.5 rounded-2xl font-bold hover:bg-brand-gold/90 transition-all disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin text-sm mr-2" />
                        {isEditing && originalListingId ? "Resubmitting..." : "Submitting..."}
                      </>
                    ) : (
                      isEditing && originalListingId ? "Resubmit for Approval" : "Submit for Approval"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
}
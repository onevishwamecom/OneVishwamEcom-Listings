import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import PageContainer, { FormSection, FormActions } from "@/components/ui/PageContainer";
import Modal from "@/components/ui/Modal";
import { STEPS, REQUIRED_BY_STEP } from "./formConfig";
import { CATEGORIES } from "./constants";
import { CategoryStep } from "./components/CategoryStep";
import { BasicInfoStep } from "./components/BasicInfoStep";
import { DetailsStep } from "./components/DetailsStep";
import { LocationStep } from "./components/LocationStep";
import { PricingStep } from "./components/PricingStep";
import { MediaStep } from "./components/MediaStep";
import { ReviewStep } from "./components/ReviewStep";
import PropertyListingForm from "./components/property/PropertyListingForm";
import { useAddListingForm } from "./useAddListingForm";

export default function AddListing() {
  const navigate = useNavigate();
  const [realEstatePhase, setRealEstatePhase] = useState(1);
  const {
    // State
    step,
    form,
    photos,
    documents,
    video,
    videoPreview,
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
    handleVideoSelect,
    handleRemoveVideo,
    handleBrochureSelect,
    handleRemoveBrochure,
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

  // When editing, skip the Category step (index 0) and start at Basic Info (index 1)
  const effectiveSteps = isEditing ? STEPS.slice(1) : STEPS;
  const stepOffset = isEditing ? 1 : 0;
  const effectiveStep = step - stepOffset;
  const effectiveIsLastStep = effectiveStep === effectiveSteps.length - 1;

  const listingId = originalListingId || `LST${Date.now().toString().slice(-6)}`;
  const isResubmission = isEditing && originalListingId;

  return (
    <>
      <PageContainer className="pb-5">
      {isEditing && (
        <div className="mb-4 rounded-xl bg-blue-50 border border-blue-100 p-3 text-sm font-medium text-blue-700 flex items-center gap-2.5 animate-fade-in shadow-sm">
          <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
            <i className="fa-solid fa-pen text-xs" aria-hidden="true" />
          </div>
          <span>
            <strong>Editing mode active</strong> — your changes will overwrite this existing listing.
          </span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 text-center" aria-live="polite">
          <i className="fa-solid fa-circle-notch fa-spin text-2xl text-brand-blue mb-3" />
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Loading Listing Data...</p>
        </div>
      ) : loadError ? (
        <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-8 text-center">
          <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-triangle-exclamation text-xl text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1.5">Failed to load</h3>
          <p className="text-slate-500 mb-4">{loadError}</p>
          <Link to="/listings" className="text-brand-blue font-bold hover:underline text-sm">
            Go back to my listings
          </Link>
        </div>
      ) : (
        <>
          {category === 'real-estate' ? (
            <div className="space-y-6 animate-fade-in">
              {/* Streamlined Header & Breadcrumbs */}
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      navigate('/add-listing');
                      updateForm('category', '');
                      setStep(0);
                    }}
                    className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer"
                    title="Back to categories"
                  >
                    <i className="fa-solid fa-arrow-left text-xs" />
                  </button>
                  <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {isEditing ? "Edit Real Estate Property" : "List Real Estate Property"}
                  </h1>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                    Step {realEstatePhase} of 3
                  </span>
                </div>
              </div>

              <PropertyListingForm
                form={form}
                updateForm={updateForm}
                photos={photos}
                onAddPhoto={handleAddPhoto}
                onRemovePhoto={removePhoto}
                video={video}
                videoPreview={videoPreview}
                onVideoSelect={handleVideoSelect}
                onRemoveVideo={handleRemoveVideo}
                brochure={brochure}
                brochureUrl={brochureUrl}
                onBrochureSelect={handleBrochureSelect}
                onRemoveBrochure={handleRemoveBrochure}
                onSubmit={handlePublish}
                onCancel={() => {
                  navigate('/add-listing');
                  updateForm('category', '');
                  setStep(0);
                }}
                onPhaseChange={setRealEstatePhase}
                submitting={submitting}
                submitError={submitError}
              />
            </div>
          ) : !isEditing && step === 0 ? (
            <div className="space-y-6 animate-fade-in">
              {/* Simple Clean Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-5 rounded-2xl border border-slate-200/80 shadow-xs">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Choose Listing Category
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select what kind of item you are listing to start
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    to="/listings"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <i className="fa-solid fa-arrow-left text-[11px]" /> Back to Listed Items
                  </Link>
                </div>
              </div>

              {/* Clean Uniform Category Grid */}
              <CategoryStep
                category={category}
                setCategory={setCategory}
                isEditing={isEditing}
              />
            </div>
          ) : (
            <>
              {/* Category Bar & Switch Category Header for Step >= 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-6 py-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center text-base font-bold shadow-xs">
                    <i className={`fa-solid ${CATEGORIES.find((c) => c.id === category)?.icon || "fa-box"}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-black text-slate-900">
                        {isEditing ? "Edit Listing" : `${CATEGORIES.find((c) => c.id === category)?.label || "Product"} Listing`}
                      </h2>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-brand-blue border border-blue-100/80">
                        {CATEGORIES.find((c) => c.id === category)?.label || "Product"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isEditing
                        ? "Update details and save your changes"
                        : "Fill in product specifications and submit for admin approval"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate('/add-listing');
                        updateForm('category', '');
                        setStep(0);
                      }}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-brand-blue hover:border-brand-blue hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <i className="fa-solid fa-arrow-rotate-left text-[11px]" /> Switch Category
                    </button>
                  )}
                  <Link
                    to="/listings"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
                  >
                    <i className="fa-solid fa-arrow-left text-[11px]" /> Back to Listed Items
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-card border border-slate-100 overflow-hidden">
                <div className="bg-slate-50/50 border-b border-slate-100 px-4 py-4">
                  <div className="flex items-start justify-between relative z-10">
                  {effectiveSteps.map((s, i) => {
                    const stepIndex = i + stepOffset;
                    const isActive = stepIndex === step;
                    const isCompleted = stepIndex < step;
                    const isClickable = stepIndex <= step;

                    return (
                      <div key={s.id} className="flex flex-col items-center gap-1.5 relative z-10 flex-1">
                        <button
                          onClick={() => isClickable && setStep(stepIndex)}
                          disabled={!isClickable}
                          className={`relative w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 z-10 ${
                            isActive
                              ? "bg-brand-blue text-white shadow-glow-blue scale-110 ring-4 ring-brand-blue/10"
                              : isCompleted
                              ? "bg-brand-gold text-brand-navy cursor-pointer hover:bg-brand-gold/90 shadow-sm"
                              : "bg-white text-slate-300 border-2 border-slate-200 cursor-not-allowed"
                          }`}
                        >
                          {isCompleted ? (
                            <i className="fa-solid fa-check text-xs" />
                          ) : (
                            <i className={`fa-solid ${s.icon} text-sm`} />
                          )}
                        </button>
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider hidden sm:block ${
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
                  <div className="absolute top-[18px] -translate-y-1/2 left-[10%] right-[10%] h-0.5 bg-slate-200 -z-0 rounded-full">
                    <div
                      className="h-full bg-brand-blue transition-all duration-500 ease-in-out rounded-full shadow-[0_0_8px_rgba(72,150,230,0.5)]"
                      style={{ width: `${(effectiveStep / (effectiveSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 sm:px-6 sm:pb-6 sm:pt-5">
                {!isEditing && step === 0 && (
                  <CategoryStep
                    category={category}
                    setCategory={setCategory}
                    isEditing={isEditing}
                  />
                )}

                {step === (isEditing ? 1 : 1) && (
                  <BasicInfoStep
                    form={form}
                    updateForm={updateForm}
                    validationErrors={validationErrors}
                  />
                )}

                {step === (isEditing ? 2 : 2) && (
                  <DetailsStep
                    form={form}
                    updateForm={updateForm}
                    category={category}
                    catFields={catFields}
                    validationErrors={validationErrors}
                  />
                )}

                {step === (isEditing ? 3 : 3) && (
                  <LocationStep
                    form={form}
                    updateForm={updateForm}
                    validationErrors={validationErrors}
                  />
                )}

                {step === (isEditing ? 4 : 4) && (
                  <PricingStep
                    form={form}
                    updateForm={updateForm}
                    validationErrors={validationErrors}
                    formatINR={formatINR}
                    category={form.category}
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
                  <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-600 flex items-center gap-2.5 animate-fade-in">
                    <i className="fa-solid fa-circle-exclamation text-base" />
                    {submitError}
                  </div>
                )}

                <FormActions>
                  {step > 0 && (
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-brand-blue rounded-xl hover:bg-brand-blue/10 transition-colors"
                    >
                      <i className="fa-solid fa-arrow-left text-xs" /> Back
                    </button>
                  )}

                  {!effectiveIsLastStep ? (
                    <button
                      onClick={handleNext}
                      disabled={!canProceed()}
                      className="inline-flex items-center gap-2 bg-brand-blue text-white px-7 py-3 rounded-2xl text-sm font-bold shadow-glow-blue hover:bg-brand-blue/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                      Next Step <i className="fa-solid fa-arrow-right text-xs" />
                    </button>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 border-2 border-brand-blue text-brand-blue px-5 py-3 rounded-2xl text-sm font-bold hover:bg-brand-blue/5 hover:border-brand-blue/70 transition-all disabled:opacity-50"
                      >
                        <i className="fa-solid fa-floppy-disk text-slate-400 text-xs" /> Save Draft
                      </button>
                      <button
                        onClick={handlePublish}
                        disabled={submitting}
                        className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-7 py-3 rounded-2xl text-sm font-bold shadow-glow-gold hover:bg-brand-gold/90 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex-1"
                      >
                        {submitting ? (
                          <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                        ) : (
                          <i className="fa-solid fa-paper-plane text-xs" />
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
                </FormActions>
              </div>
            </div>
          </>
        )}
        </>
      )}
    </PageContainer>

    <Modal
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      title={isEditing && originalListingId ? "Resubmit Listing?" : "Submit Listing?"}
      description={isEditing && originalListingId
        ? "Your changes will be sent to the admin for another review. The listing will return to Pending Approval."
        : "Your listing will be sent for admin review after submission. You can still edit it from the Pending tab if changes are needed."}
      confirmText={submitting
        ? (isEditing && originalListingId ? "Resubmitting..." : "Submitting...")
        : (isEditing && originalListingId ? "Resubmit for Approval" : "Submit for Approval")}
      cancelText="Cancel"
      onConfirm={handleConfirmSubmit}
      loading={submitting}
      size="md"
    />

    <Modal
      isOpen={submitted}
      onClose={() => {}}
      showFooter={false}
      closeOnOverlayClick={false}
      size="md"
    >
      <div className="text-center py-4">
        <div className="relative mb-6 mt-2">
          <div className="absolute inset-0 bg-brand-gold blur-3xl opacity-20 rounded-full" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-brand-gold to-brand-gold/70 flex items-center justify-center mx-auto shadow-float text-white border-4 border-white">
            <i className="fa-solid fa-check text-3xl" />
          </div>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
          {isResubmission ? "Listing Resubmitted!" : isEditing ? "Listing Updated!" : "Listing Submitted for Approval!"}
        </h2>

        <p className="text-sm text-slate-500 font-medium mb-6 max-w-sm mx-auto">
          {isResubmission
            ? "Your updated listing has been sent for admin approval."
            : isEditing
            ? "Your listing changes have been saved and sent for review."
            : "Your listing has been submitted and is now pending admin approval."}
        </p>

        <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full text-left">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500 flex items-center gap-2">
              <i className="fa-solid fa-clock text-brand-gold" /> Status
            </span>
            <Badge variant="pending" icon="fa-clock" className="text-sm px-3 py-1.5">
              Pending Approval
            </Badge>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Listing ID</span>
            <span className="font-mono text-base font-extrabold text-brand-blue">{listingId}</span>
          </div>
        </div>

        {brochureUrl && (
          <a
            href={brochureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-6 inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 hover:bg-white hover:shadow-sm transition-all"
          >
            <i className="fa-solid fa-file-pdf text-red-500 text-base" />
            View Uploaded Brochure
          </a>
        )}

        <div className="flex flex-col gap-3">
          <Link
            to="/listings?status=pending"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-blue to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-glow-blue hover:bg-brand-blue/90 transition-all duration-300 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-list" /> View Pending Listings
          </Link>
          {!isEditing && (
            <button
              onClick={() => {
                window.location.href = "/add-listing";
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-6 py-3 rounded-2xl font-bold text-sm hover:border-slate-300 hover:bg-slate-50 transition-all duration-300 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-plus" /> Add Another
            </button>
          )}
        </div>
      </div>
    </Modal>
    </>
  );
}
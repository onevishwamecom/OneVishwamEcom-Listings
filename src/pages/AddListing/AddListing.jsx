import React, { useState } from "react";
import Badge from "@/components/ui/Badge";
import { Link, useNavigate } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";
import PageContainer, { FormSection, FormActions } from "@/components/ui/PageContainer";
import Modal from "@/components/ui/Modal";
import { STEPS, REQUIRED_BY_STEP } from "./formConfig";
import { CATEGORIES } from "./constants";
import { CategoryStep } from "./components/CategoryStep";
import PropertyListingForm from "./components/property/PropertyListingForm";
import UniversalCategoryListingForm from "./components/UniversalCategoryListingForm";
import { useAddListingForm } from "./useAddListingForm";

export default function AddListing() {
  const navigate = useNavigate();
  const [propertiesPhase, setPropertiesPhase] = useState(1);
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
    handleAddPhotoUrl,
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

  const currentCategoryMeta = CATEGORIES.find((c) => c.id === category) || {
    label: "Item",
    singularLabel: "Item",
  };
  const categoryTitle = currentCategoryMeta.singularLabel || currentCategoryMeta.label;

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
      ) : !isEditing && !category ? (
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
        <div className="space-y-6 animate-fade-in">
          {/* Streamlined Header & Breadcrumbs for all categories */}
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
                {isEditing ? `Edit ${categoryTitle}` : `List ${categoryTitle}`}
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/bulk-listing/${category}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-all shadow-sm"
              >
                <i className="fa-solid fa-file-excel text-emerald-600 text-[11px]" /> Bulk Excel Upload
              </Link>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200/60">
                Step {propertiesPhase} of 3
              </span>
            </div>
          </div>

          {(category === 'properties' || category === 'real-estate') ? (
            <PropertyListingForm
              form={form}
              updateForm={updateForm}
              photos={photos}
              onAddPhoto={handleAddPhoto}
              onAddPhotoUrl={handleAddPhotoUrl}
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
              onPhaseChange={setPropertiesPhase}
              submitting={submitting}
              submitError={submitError}
            />
          ) : (
            <UniversalCategoryListingForm
              category={category}
              form={form}
              updateForm={updateForm}
              catFields={catFields}
              photos={photos}
              onAddPhoto={handleAddPhoto}
              onAddPhotoUrl={handleAddPhotoUrl}
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
              onSaveDraft={handleSaveDraft}
              onPhaseChange={setPropertiesPhase}
              submitting={submitting}
              submitError={submitError}
              validationErrors={validationErrors}
              isEditing={isEditing}
            />
          )}
        </div>
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
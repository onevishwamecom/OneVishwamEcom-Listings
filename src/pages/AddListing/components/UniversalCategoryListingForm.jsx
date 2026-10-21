import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/authSlice';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getCategoryConfig, normalizeCategoryKey } from '@/config/listingConfig';
import { SUBCATEGORY_CARDS, SUBCATEGORIES } from '../constants';
import ListingPhaseStepper from './shared/ListingPhaseStepper';
import ListerIdentityCard from './shared/ListerIdentityCard';
import LocationFieldsSection from './shared/LocationFieldsSection';
import PricingFieldsSection from './shared/PricingFieldsSection';
import MediaUploadSection from './shared/MediaUploadSection';
import PhaseNavigationActions from './shared/PhaseNavigationActions';

const PHASES = [
  { step: 1, title: 'Partner & Category' },
  { step: 2, title: 'Specifications' },
  { step: 3, title: 'Media & Approvals' },
];

export default function UniversalCategoryListingForm({
  category = 'vehicle',
  form = {},
  updateForm,
  catFields = [],
  photos = [],
  onAddPhoto,
  onAddPhotoUrl,
  onRemovePhoto,
  video = null,
  videoPreview = null,
  onVideoSelect,
  onRemoveVideo,
  brochure = null,
  brochureUrl = null,
  onBrochureSelect,
  onRemoveBrochure,
  onSubmit,
  onCancel,
  onSaveDraft,
  onPhaseChange,
  submitting = false,
  submitError = null,
  validationErrors = {},
  isEditing = false,
}) {
  const [activePhase, setActivePhase] = useState(1);
  const [localErrors, setLocalErrors] = useState({});

  const { user } = useAuth();
  const userEmail = (user?.email || '').toLowerCase();
  const isOneVishwam = user?.role === 'in_house' || userEmail.endsWith('@onevishwam.com');

  const resolvedPartnerName = isOneVishwam ? 'One Vishwam' : user?.name || 'Verified Lister';
  const resolvedVendorName = isOneVishwam ? 'One Vishwam' : user?.name || 'Independent Lister';
  const displayName = isOneVishwam ? 'One Vishwam' : (form.channelPartnerName || form.vendorName || resolvedPartnerName);

  useEffect(() => {
    onPhaseChange?.(activePhase);
  }, [activePhase, onPhaseChange]);

  useEffect(() => {
    if (form.channelPartnerName !== resolvedPartnerName) {
      updateForm('channelPartnerName', resolvedPartnerName);
    }
    if (form.vendorName !== resolvedVendorName) {
      updateForm('vendorName', resolvedVendorName);
    }
  }, [resolvedPartnerName, resolvedVendorName, form.channelPartnerName, form.vendorName, updateForm]);

  const categoryMeta = getCategoryConfig(category);

  // Subcategories configured with cards/icons
  const subcategoryList =
    SUBCATEGORY_CARDS[category] ||
    (SUBCATEGORIES[category] || categoryMeta.subcategories || []).map((s) => ({
      id: s,
      label: s,
      icon: categoryMeta.icon || 'fa-tag',
    }));

  const selectedSubcategory =
    form.subcategory ||
    form.categoryVehicle ||
    form.wheelerType ||
    form.bodyType ||
    (subcategoryList.length > 0 ? subcategoryList[0].id : '');

  // Auto-init subcategory if missing
  useEffect(() => {
    if (!form.subcategory && subcategoryList.length > 0) {
      const defaultSub = subcategoryList[0].id;
      updateForm('subcategory', defaultSub);
      if (category === 'vehicle' || category === 'vehicles') {
        updateForm('categoryVehicle', defaultSub);
      }
    }
  }, [category, form.subcategory, subcategoryList, updateForm]);

  const handleSelectSubcategory = (subId) => {
    updateForm('subcategory', subId);
    if (category === 'vehicle' || category === 'vehicles') {
      updateForm('categoryVehicle', subId);
    }
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next.subcategory;
      return next;
    });
  };

  // Phase validation
  const validatePhase1 = () => {
    const errs = {};
    if (!selectedSubcategory) {
      errs.subcategory = `Please select a ${categoryMeta.singularLabel || categoryMeta.label} category`;
    }
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePhase2 = () => {
    const errs = {};
    if (!form.title?.trim() && (!form.brand?.trim() || !form.model?.trim())) {
      errs.title = 'Listing title or Brand & Model is required';
    }
    if (!form.price && form.priceType !== 'on-request') {
      errs.price = 'Please provide an asking price';
    }
    if (!form.area?.trim() && !form.address?.trim()) {
      errs.area = 'Area or locality is required';
    }

    catFields.forEach((field) => {
      if (field.required && !form[field.name]) {
        errs[field.name] = `${field.label} is required`;
      }
    });

    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePhase3 = () => {
    const errs = {};
    if (photos.length === 0) {
      errs.photos = 'Please upload at least 1 photo for approval';
    }
    setLocalErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextPhase = () => {
    if (activePhase === 1) {
      if (validatePhase1()) {
        setActivePhase(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (activePhase === 2) {
      if (validatePhase2()) {
        setActivePhase(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePrevPhase = () => {
    if (activePhase > 1) {
      setActivePhase(activePhase - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepJump = (targetStep) => {
    if (targetStep < activePhase) {
      setActivePhase(targetStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (targetStep === 2 && activePhase === 1) {
      if (validatePhase1()) {
        setActivePhase(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (targetStep === 3 && activePhase === 2) {
      if (validatePhase2()) {
        setActivePhase(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleFinalSubmit = (e) => {
    e?.preventDefault?.();
    if (!validatePhase1()) {
      setActivePhase(1);
      return;
    }
    if (!validatePhase2()) {
      setActivePhase(2);
      return;
    }
    if (!validatePhase3()) {
      setActivePhase(3);
      return;
    }
    onSubmit();
  };

  const mergedErrors = { ...validationErrors, ...localErrors };

  return (
    <div className="space-y-6">
      {/* Shared Horizontal Step Progress Bar */}
      <ListingPhaseStepper phases={PHASES} activePhase={activePhase} onStepJump={handleStepJump} />

      {/* ── STEP 1: Partner & Category ── */}
      {activePhase === 1 && (
        <div className="space-y-6 animate-fade-in">
          <ListerIdentityCard
            displayName={displayName}
            category={category}
            categoryLabel={categoryMeta.label}
            categoryBadge={categoryMeta.badge}
            isOneVishwam={isOneVishwam}
            isEditing={isEditing}
          />

          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className={`fa-solid ${categoryMeta.icon || 'fa-tag'} text-brand-blue`} />
                <span>Select {categoryMeta.singularLabel || categoryMeta.label} Subcategory</span>
                <span className="text-red-500">*</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Choose the exact classification for this listing
              </p>
            </div>

            {mergedErrors.subcategory && (
              <p className="text-xs font-semibold text-red-500">{mergedErrors.subcategory}</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {subcategoryList.map((sub) => {
                const isSelected = selectedSubcategory === sub.id || form.subcategory === sub.id;
                return (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => handleSelectSubcategory(sub.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-brand-blue bg-blue-50/70 text-brand-blue ring-2 ring-brand-blue/20 shadow-xs'
                        : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/50 text-slate-700'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 text-base transition-transform group-hover:scale-105 ${
                        isSelected ? 'bg-brand-blue text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <i className={`fa-solid ${sub.icon || categoryMeta.icon || 'fa-tag'}`} />
                    </div>
                    <span className="text-xs font-bold leading-tight line-clamp-1">{sub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 2: Specifications, Pricing, Location ── */}
      {activePhase === 2 && (
        <div className="space-y-6 animate-fade-in">
          {/* Identity & Basic Info Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <i className="fa-solid fa-file-pen text-brand-blue" />
                <span>Listing Identity &amp; Headline</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Primary title, headline, and public description</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Listing Title / Headline"
                  required
                  placeholder={`e.g. ${
                    category === 'vehicle' || category === 'vehicles'
                      ? 'Maruti Suzuki Swift ZXi 2024 · Brand New Bangalore'
                      : category === 'groceries'
                      ? 'Premium Organic Sona Masoori Rice - 25 Kg Pack'
                      : 'Featured Listing Title'
                  }`}
                  value={form.title || ''}
                  onChange={(e) => updateForm('title', e.target.value)}
                  error={mergedErrors.title}
                />
              </div>

              <div className="sm:col-span-2">
                <Input
                  label="Short Subtitle / Highlight Tagline"
                  placeholder="e.g. Factory Warranty · Instant Delivery · Bangalore Dealership"
                  value={form.subtitle || ''}
                  onChange={(e) => updateForm('subtitle', e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Provide comprehensive details, key benefits, terms, and highlights for buyers..."
                  value={form.description || ''}
                  onChange={(e) => updateForm('description', e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 p-3.5 focus:outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Category Specifications Card */}
          {catFields.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-cyan-600" />
                  <span>{categoryMeta.label} Specifications</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Key attributes and equipment</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {catFields.map((field) => (
                  <div key={field.name} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
                    {field.type === 'select' ? (
                      <Select
                        label={field.label}
                        required={field.required}
                        value={form[field.name] || ''}
                        onChange={(e) => updateForm(field.name, e.target.value)}
                        options={field.options || []}
                        error={mergedErrors[field.name]}
                      />
                    ) : (
                      <Input
                        label={field.label}
                        type={field.type || 'text'}
                        required={field.required}
                        placeholder={field.placeholder || ''}
                        value={form[field.name] || ''}
                        onChange={(e) => updateForm(field.name, e.target.value)}
                        error={mergedErrors[field.name]}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reusable Standardized Pricing Section */}
          <PricingFieldsSection form={form} updateForm={updateForm} category={category} errors={mergedErrors} />

          {/* Reusable Standardized Location Section */}
          <LocationFieldsSection form={form} updateForm={updateForm} errors={mergedErrors} />
        </div>
      )}

      {/* ── STEP 3: Media & Approvals ── */}
      {activePhase === 3 && (
        <MediaUploadSection
          photos={photos}
          onAddPhoto={onAddPhoto}
          onAddPhotoUrl={onAddPhotoUrl}
          onRemovePhoto={onRemovePhoto}
          video={video}
          videoPreview={videoPreview}
          onVideoSelect={onVideoSelect}
          onRemoveVideo={onRemoveVideo}
          brochure={brochure}
          brochureUrl={brochureUrl}
          onBrochureSelect={onBrochureSelect}
          onRemoveBrochure={onRemoveBrochure}
          form={form}
          updateForm={updateForm}
          errors={mergedErrors}
        />
      )}

      {/* Reusable Bottom Navigation & Action Bar */}
      <PhaseNavigationActions
        activePhase={activePhase}
        totalPhases={3}
        onPrev={handlePrevPhase}
        onNext={handleNextPhase}
        onSubmit={handleFinalSubmit}
        onCancel={onCancel}
        onSaveDraft={onSaveDraft}
        submitting={submitting}
        submitError={submitError}
        isEditing={isEditing}
      />
    </div>
  );
}

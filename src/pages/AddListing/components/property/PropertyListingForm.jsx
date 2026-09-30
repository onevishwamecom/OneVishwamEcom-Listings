import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/authSlice';
import { resolvePartnerIdentity } from '@/config/partnerDirectory';
import Phase1Header from './Phase1Header';
import ResidentialFields from './ResidentialFields';
import ResidentialUnitFields from './ResidentialUnitFields';
import AgriculturalFields from './AgriculturalFields';
import CommercialFields from './CommercialFields';
import PlotFields from './PlotFields';
import IndustrialFields from './IndustrialFields';
import Phase3FinalFields from './Phase3FinalFields';

const PHASES = [
  {
    step: 1,
    title: 'Partner & Category',
  },
  {
    step: 2,
    title: 'Specifications',
  },
  {
    step: 3,
    title: 'Media & Approvals',
  },
];

export default function PropertyListingForm({
  form = {},
  updateForm,
  photos = [],
  onAddPhoto,
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
  onPhaseChange,
  submitting = false,
  submitError = null,
}) {
  const [activePhase, setActivePhase] = useState(1);
  const [errors, setErrors] = useState({});

  const { user } = useAuth();
  const partnerInfo = resolvePartnerIdentity(user?.email || user?.vendorEmail);
  const userEmail = (user?.email || user?.vendorEmail || '').toLowerCase();
  const isOneVishwam = user?.role === 'in_house' || partnerInfo?.role === 'in_house' || userEmail.endsWith('@onevishwam.com');

  const resolvedPartnerName = isOneVishwam
    ? 'One Vishwam'
    : (user?.partnerName || partnerInfo?.partnerName || user?.fullName || user?.name || user?.displayName || userEmail || 'External Partner');

  const resolvedVendorName = isOneVishwam
    ? 'One Vishwam'
    : (user?.fullName || user?.name || user?.partnerName || partnerInfo?.partnerName || user?.displayName || userEmail || 'Independent Owner');

  useEffect(() => {
    onPhaseChange?.(activePhase);
  }, [activePhase, onPhaseChange]);

  const vendorName = form.vendorName || resolvedVendorName;
  const channelPartnerName = form.channelPartnerName || resolvedPartnerName;
  const propertyType = form.propertyType || 'Residential';
  const bankLoanDetails = form.bankLoanDetails || '';
  const details = form.details || {};

  useEffect(() => {
    if (form.channelPartnerName !== resolvedPartnerName) {
      updateForm('channelPartnerName', resolvedPartnerName);
    }
    if (form.vendorName !== resolvedVendorName) {
      updateForm('vendorName', resolvedVendorName);
    }
  }, [resolvedPartnerName, resolvedVendorName, form.channelPartnerName, form.vendorName, updateForm]);

  const isStep1Valid = Boolean(propertyType);

  const handleRootChange = (key, val) => {
    if (key === 'propertyType' && val !== propertyType) {
      updateForm('propertyType', val);
      updateForm('details', {});
      setErrors((prev) => {
        const next = { ...prev };
        delete next.propertyType;
        return next;
      });
      return;
    }
    updateForm(key, val);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  const handleDetailsChange = (key, val) => {
    const nextDetails = { ...details, [key]: val };
    updateForm('details', nextDetails);
    if (errors[key]) {
      setErrors((prev) => ({ ...prev, [key]: null }));
    }
  };

  // Phase 1 validation (Identity is auto-derived, so only property category selection is validated)
  const validatePhase1 = () => {
    const errs = {};
    if (!propertyType) errs.propertyType = 'Please select a property category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Phase 2 validation for the active category
  const validatePhase2 = () => {
    const errs = {};
    const d = details || {};

    const getVal = (dKey, rootKey) => {
      const v = d[dKey] !== undefined && d[dKey] !== null && String(d[dKey]).trim() !== '' 
        ? d[dKey] 
        : (form[rootKey] !== undefined && form[rootKey] !== null ? form[rootKey] : '');
      return typeof v === 'string' ? v.trim() : (v !== undefined && v !== null ? String(v) : '');
    };

    if (propertyType === 'Residential') {
      if (!getVal('propertyName', 'title')) errs.propertyName = 'Property / Project Name is required';
      if (!getVal('dimensions', 'area_sqft') && !getVal('dimensions', 'area')) errs.dimensions = 'Dimensions are required';
      if (!getVal('facing', 'facing')) errs.facing = 'Property Facing is required';
      if (!getVal('cornerPlot', 'cornerPlot')) errs.cornerPlot = 'Corner Plot selection is required';
      if (!getVal('approvedLayout', 'approval')) errs.approvedLayout = 'Approved Layout is required';
      if (!getVal('approvalAuthority', 'approval')) errs.approvalAuthority = 'Approval Authority is required';
      if (!getVal('expectedPrice', 'price')) errs.expectedPrice = 'Expected Price is required';
      if (!getVal('negotiable', 'negotiable')) errs.negotiable = 'Negotiable selection is required';
    } else if (propertyType === 'Flat/Villa' || propertyType === 'Independent House') {
      if (!getVal('projectName', 'title')) errs.projectName = 'Project / Society / House Name is required';
      if (!getVal('bhk', 'bhk')) errs.bhk = 'BHK configuration is required';
      if (!getVal('superBuiltUpArea', 'area_sqft') && !getVal('superBuiltUpArea', 'area')) errs.superBuiltUpArea = 'Super Built-up Area is required';
      if (!getVal('floors', 'floor')) errs.floors = 'Floor information is required';
      if (!getVal('facing', 'facing')) errs.facing = 'Facing is required';
      if (!getVal('bathrooms', 'bathrooms')) errs.bathrooms = 'Number of Bathrooms is required';
      if (!getVal('balconies', 'balconies')) errs.balconies = 'Number of Balconies is required';
      if (!getVal('furnishing', 'furnishing')) errs.furnishing = 'Furnishing Status is required';
      if (!getVal('expectedPrice', 'price')) errs.expectedPrice = 'Expected Price is required';
    } else if (propertyType === 'Agricultural') {
      if (!getVal('totalLandExtent', 'area') && !getVal('totalLandExtent', 'area_sqft')) errs.totalLandExtent = 'Total Land Extent is required';
      if (!getVal('expectedPrice', 'price')) errs.expectedPrice = 'Expected Price is required';
    } else if (propertyType === 'Commercial') {
      if (!getVal('commercialType', 'subcategory')) errs.commercialType = 'Commercial Type is required';
      if (!getVal('expectedPrice', 'price')) errs.expectedPrice = 'Expected Price is required';
    } else if (propertyType === 'Plot/Land') {
      if (!getVal('projectName', 'title')) errs.projectName = 'Project / Layout Name is required';
      if (!getVal('expectedPrice', 'price')) errs.expectedPrice = 'Expected Price is required';
    } else if (propertyType === 'Industrial') {
      if (!getVal('industrialType', 'subcategory')) errs.industrialType = 'Industrial Type is required';
      if (!getVal('expectedPrice', 'price')) errs.expectedPrice = 'Expected Price is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Phase 3 validation
  const validatePhase3 = () => {
    const errs = {};
    if (!bankLoanDetails.trim()) errs.bankLoanDetails = 'Bank Loan Approval Details are required';
    setErrors(errs);
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

  return (
    <div className="space-y-6">
      {/* Minimalist Horizontal Step Progress Bar */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 sm:px-6 shadow-xs">
        <div className="flex items-center justify-between">
          {PHASES.map((p, idx) => {
            const isActive = p.step === activePhase;
            const isCompleted = p.step < activePhase;
            const isClickable = p.step <= activePhase;

            return (
              <React.Fragment key={p.step}>
                <button
                  type="button"
                  onClick={() => handleStepJump(p.step)}
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
                      isActive
                        ? 'text-brand-blue font-bold'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    Step {p.step}: {p.title}
                  </span>
                  <span
                    className={`text-xs font-semibold sm:hidden transition-colors ${
                      isActive
                        ? 'text-brand-blue font-bold'
                        : isCompleted
                        ? 'text-slate-700'
                        : 'text-slate-400'
                    }`}
                  >
                    {p.title}
                  </span>
                </button>

                {idx < PHASES.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-3 sm:mx-6 transition-colors ${
                      p.step < activePhase ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Content Area */}
      <div className="space-y-6">
        {activePhase === 1 && (
          <Phase1Header
            vendorName={vendorName}
            channelPartnerName={channelPartnerName}
            propertyType={propertyType}
            onChange={handleRootChange}
            errors={errors}
            isOneVishwam={isOneVishwam}
            user={user}
          />
        )}

        {activePhase === 2 && (
          <div>
            {propertyType === 'Residential' && (
              <ResidentialFields
                details={details}
                onChange={handleDetailsChange}
                errors={errors}
              />
            )}

            {(propertyType === 'Flat/Villa' || propertyType === 'Independent House') && (
              <ResidentialUnitFields
                propertyType={propertyType}
                details={details}
                onChange={handleDetailsChange}
                errors={errors}
              />
            )}

            {propertyType === 'Agricultural' && (
              <AgriculturalFields
                details={details}
                onChange={handleDetailsChange}
                errors={errors}
              />
            )}

            {propertyType === 'Commercial' && (
              <CommercialFields
                details={details}
                onChange={handleDetailsChange}
                errors={errors}
              />
            )}

            {propertyType === 'Plot/Land' && (
              <PlotFields
                details={details}
                onChange={handleDetailsChange}
                errors={errors}
              />
            )}

            {propertyType === 'Industrial' && (
              <IndustrialFields
                details={details}
                onChange={handleDetailsChange}
                errors={errors}
              />
            )}
          </div>
        )}

        {activePhase === 3 && (
          <Phase3FinalFields
            bankLoanDetails={bankLoanDetails}
            onChange={handleRootChange}
            photos={photos}
            onAddPhoto={onAddPhoto}
            onRemovePhoto={onRemovePhoto}
            video={video}
            videoPreview={videoPreview}
            onVideoSelect={onVideoSelect}
            onRemoveVideo={onRemoveVideo}
            brochure={brochure}
            brochureUrl={brochureUrl}
            onBrochureSelect={onBrochureSelect}
            onRemoveBrochure={onRemoveBrochure}
            errors={errors}
          />
        )}
      </div>

      {submitError && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4 text-xs font-semibold text-red-700 flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-sm" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Pinned / Docked Bottom Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => {
            if (activePhase === 1) {
              onCancel?.();
            } else {
              handlePrevPhase();
            }
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left text-[11px]" />
          <span>{activePhase === 1 ? 'Cancel / Back' : 'Previous Step'}</span>
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
          <span>Step {activePhase} of 3</span>
          <span>•</span>
          <span className="text-slate-700 font-bold">{PHASES[activePhase - 1]?.title}</span>
        </div>

        {activePhase < 3 ? (
          <button
            type="button"
            onClick={handleNextPhase}
            disabled={activePhase === 1 && !isStep1Valid}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activePhase === 1 && !isStep1Valid
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-brand-blue text-white hover:bg-blue-700 shadow-sm shadow-brand-blue/25 hover:shadow cursor-pointer'
            }`}
          >
            <span>Continue to Step {activePhase + 1}</span>
            <i className="fa-solid fa-arrow-right text-[11px]" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={submitting}
            className={`inline-flex items-center gap-2 px-7 py-2.5 rounded-lg bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xs font-bold shadow-md shadow-brand-blue/25 transition-all ${
              submitting
                ? 'opacity-60 cursor-wait'
                : 'hover:opacity-95 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer'
            }`}
          >
            {submitting ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin text-xs" />
                <span>Publishing Listing...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane text-xs" />
                <span>Publish Property Listing</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

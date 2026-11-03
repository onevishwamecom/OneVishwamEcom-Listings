import React, { useState, useEffect } from 'react';
import { useAuth } from '@/store/authSlice';
import Phase1Header from './Phase1Header';
import ResidentialFields from './ResidentialFields';
import ResidentialUnitFields from './ResidentialUnitFields';
import AgriculturalFields from './AgriculturalFields';
import CommercialFields from './CommercialFields';
import PlotFields from './PlotFields';
import IndustrialFields from './IndustrialFields';
import Phase3FinalFields from './Phase3FinalFields';
import ListingPhaseStepper from '../shared/ListingPhaseStepper';
import PhaseNavigationActions from '../shared/PhaseNavigationActions';

const PHASES = [
  { step: 1, title: 'Partner & Category' },
  { step: 2, title: 'Specifications' },
  { step: 3, title: 'Media & Approvals' },
];

export default function PropertyListingForm({
  form = {},
  updateForm,
  photos = [],
  onAddPhoto,
  onAddPhotoUrl,
  onRemovePhoto,
  onMovePhoto,
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
  const userEmail = (user?.email || '').toLowerCase();
  const isOneVishwam = user?.role === 'in_house' || userEmail.endsWith('@onevishwam.com');

  const listerName = user?.name || user?.fullName || 'Verified Lister';
  const resolvedPartnerName = isOneVishwam ? 'One Vishwam' : (user?.partnerName || listerName);
  const resolvedVendorName = isOneVishwam ? 'One Vishwam' : (user?.vendorName || listerName);

  useEffect(() => {
    onPhaseChange?.(activePhase);
  }, [activePhase, onPhaseChange]);

  const vendorName = form.vendorName || resolvedVendorName;
  const channelPartnerName = form.channelPartnerName || resolvedPartnerName;
  const propertyType = form.propertyType || 'Plot';
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

  const handleDetailsChange = (keyOrObj, val) => {
    if (typeof keyOrObj === 'object' && keyOrObj !== null) {
      updateForm('details', (prev) => ({
        ...(typeof prev === 'object' && prev !== null ? prev : {}),
        ...keyOrObj,
      }));
      setErrors((prev) => {
        const next = { ...prev };
        Object.keys(keyOrObj).forEach((k) => delete next[k]);
        return next;
      });
      return;
    }
    updateForm('details', (prev) => ({
      ...(typeof prev === 'object' && prev !== null ? prev : {}),
      [keyOrObj]: val,
    }));
    if (errors[keyOrObj]) {
      setErrors((prev) => ({ ...prev, [keyOrObj]: null }));
    }
  };

  const validatePhase1 = () => {
    const errs = {};
    if (!propertyType) errs.propertyType = 'Please select a property category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePhase2 = () => {
    const errs = {};
    const d = details || {};

    const priceVal = d.expectedPrice || d.price || form.expectedPrice || form.price;

    if (propertyType === 'Residential') {
      const nameVal = d.propertyName || d.projectName || form.title;
      if (!nameVal) errs.propertyName = 'Property / Project Name is required';
      const dimVal = d.dimensions || form.area_sqft || form.area;
      if (!dimVal) errs.dimensions = 'Dimensions (Length x Width) are required';
      const facingVal = d.facing || form.facing;
      if (!facingVal) errs.facing = 'Property Facing is required';
      if (!d.cornerPlot) errs.cornerPlot = 'Corner Plot selection is required';
      if (!d.approvedLayout) errs.approvedLayout = 'Approved Layout selection is required';
      if (!d.approvalAuthority) errs.approvalAuthority = 'Approval Authority is required';
      if (!priceVal) errs.expectedPrice = 'Asking Price or Rate is required';
    } else if (propertyType === 'Flat' || propertyType === 'Flat / Villa' || propertyType === 'Flat/Villa' || propertyType === 'Independent House') {
      const projName = d.projectName || d.propertyName || d.apartmentName || form.title;
      if (!projName) errs.projectName = 'Project / Society / House Name is required';
      const bhkVal = d.bhk || form.bhk;
      if (!bhkVal) errs.bhk = 'BHK configuration is required';
      const areaVal = d.superBuiltUpArea || d.carpetArea || d.builtUpArea || form.area_sqft || form.area;
      if (!areaVal) errs.superBuiltUpArea = 'Super Built-up Area is required';
      const facingVal = d.facing || form.facing;
      if (!facingVal) errs.facing = 'Facing direction is required';
      const bathVal = d.bathrooms || form.bathrooms;
      if (!bathVal) errs.bathrooms = 'Bathrooms count is required';
      const furnVal = d.furnishingStatus || d.furnishing || form.furnishing;
      if (!furnVal) errs.furnishingStatus = 'Furnishing Status is required';
      if (!priceVal) errs.expectedPrice = 'Asking Price is required';
    } else if (propertyType === 'Plot' || propertyType === 'Land' || propertyType === 'Plot / Land' || propertyType === 'Plot/Land') {
      const layoutName = d.projectName || d.propertyName || form.title;
      if (!layoutName) errs.projectName = 'Project / Layout Name is required';
      if (!d.plotType) errs.plotType = 'Type of Plot / Land is required';
      const landArea = d.totalLandArea || d.plotDimensions || form.area_sqft || form.area;
      if (!landArea) errs.totalLandArea = 'Total Land Area is required';
      const plotDim = d.plotDimensions || d.dimensions || form.area_sqft || form.area;
      if (!plotDim) errs.plotDimensions = 'Plot Dimensions are required';
      const authVal = d.approvalAuthority || d.approvedLayout || form.approval;
      if (!authVal) errs.approvalAuthority = 'Approval Authority is required';
      if (!priceVal) errs.expectedPrice = 'Expected Price per Sq. Ft. / Acre is required';
    } else if (propertyType === 'Commercial') {
      const commName = d.propertyName || d.projectName || form.title;
      if (!commName) errs.propertyName = 'Commercial Property Name is required';
      const commType = d.commercialType || form.subcategory;
      if (!commType) errs.commercialType = 'Commercial Space Type is required';
      const commArea = d.carpetArea || d.builtUpArea || d.dimensions || form.area_sqft || form.area;
      if (!commArea) errs.carpetArea = 'Carpet Area or Built-up Area is required';
      if (!priceVal) errs.expectedPrice = 'Expected Price is required';
    } else if (propertyType === 'Agricultural') {
      const agriName = d.propertyName || d.projectName || form.title;
      if (!agriName) errs.propertyName = 'Land Name / Title is required';
      const landExtent = d.totalLandExtent || d.landSize || form.area_sqft || form.area;
      if (!landExtent) errs.totalLandExtent = 'Total Land Extent is required';
      if (!d.surveyNumber) errs.surveyNumber = 'Survey Number is required';
      if (!d.landType) errs.landType = 'Type of Land is required';
      if (!priceVal) errs.expectedPrice = 'Expected Price is required';
    } else if (propertyType === 'Industrial') {
      if (!d.industrialType) errs.industrialType = 'Type of Industrial Property is required';
      if (!d.propertyStatus) errs.propertyStatus = 'Property Status is required';
      const indArea = d.totalLandArea || d.plotArea || form.area_sqft || form.area;
      if (!indArea) errs.totalLandArea = 'Total Land Area is required';
      if (!priceVal) errs.expectedPrice = 'Expected Price is required';
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        const firstErrorEl = document.querySelector('.border-red-300, .border-red-500, [aria-invalid="true"]');
        if (firstErrorEl) {
          firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (typeof firstErrorEl.focus === 'function') firstErrorEl.focus();
        } else {
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      }, 50);
      return false;
    }
    return true;
  };

  const validatePhase3 = () => {
    const errs = {};
    if (photos.length === 0) errs.photos = 'Please upload at least 1 photo for approval';
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
      {/* Shared Horizontal Step Progress Bar */}
      <ListingPhaseStepper phases={PHASES} activePhase={activePhase} onStepJump={handleStepJump} />

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
          <div className="space-y-6 animate-fade-in">
            {propertyType === 'Residential' && (
              <ResidentialFields details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {(propertyType === 'Flat' || propertyType === 'Flat / Villa' || propertyType === 'Flat/Villa' || propertyType === 'Independent House') && (
              <ResidentialUnitFields propertyType={propertyType} details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {propertyType === 'Agricultural' && (
              <AgriculturalFields details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {propertyType === 'Commercial' && (
              <CommercialFields details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {(propertyType === 'Plot' || propertyType === 'Land' || propertyType === 'Plot / Land' || propertyType === 'Plot/Land') && (
              <PlotFields details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {propertyType === 'Industrial' && (
              <IndustrialFields details={details} onChange={handleDetailsChange} errors={errors} />
            )}
          </div>
        )}

        {activePhase === 3 && (
          <Phase3FinalFields
            form={form}
            bankLoanDetails={bankLoanDetails}
            onChange={handleRootChange}
            photos={photos}
            onAddPhoto={onAddPhoto}
            onAddPhotoUrl={onAddPhotoUrl}
            onRemovePhoto={onRemovePhoto}
            onMovePhoto={onMovePhoto}
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

      {/* Validation Error Banner */}
      {Object.keys(errors).length > 0 && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-600 flex items-center gap-2 animate-fade-in shadow-xs">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-sm shrink-0" />
          <span>Please complete the required field{Object.keys(errors).length > 1 ? 's' : ''}: {Object.values(errors).filter(Boolean).join(', ')}</span>
        </div>
      )}

      {/* Shared Navigation and Action Bar */}
      <PhaseNavigationActions
        activePhase={activePhase}
        totalPhases={3}
        onPrev={handlePrevPhase}
        onNext={handleNextPhase}
        onSubmit={handleFinalSubmit}
        onCancel={onCancel}
        submitting={submitting}
        submitError={submitError}
      />
    </div>
  );
}

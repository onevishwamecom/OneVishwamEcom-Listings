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

  const resolvedPartnerName = isOneVishwam ? 'One Vishwam' : user?.name || 'Verified Lister';
  const resolvedVendorName = isOneVishwam ? 'One Vishwam' : user?.name || 'Independent Owner';

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
      if (!getVal('price', 'price')) errs.price = 'Asking Price is required';
      if (!getVal('area', 'area')) errs.area = 'Locality / Area is required';
    } else if (propertyType === 'Flat/Villa' || propertyType === 'Independent House') {
      if (!getVal('propertyName', 'title')) errs.propertyName = 'Property Name is required';
      if (!getVal('bhk', 'bhk')) errs.bhk = 'BHK configuration is required';
      if (!getVal('bathrooms', 'bathrooms')) errs.bathrooms = 'Bathrooms count is required';
      if (!getVal('facing', 'facing')) errs.facing = 'Facing direction is required';
      if (!getVal('furnishing', 'furnishing')) errs.furnishing = 'Furnishing Status is required';
      if (!getVal('price', 'price')) errs.price = 'Asking Price is required';
      if (!getVal('area', 'area')) errs.area = 'Locality / Area is required';
    } else if (propertyType === 'Agricultural') {
      if (!getVal('propertyName', 'title')) errs.propertyName = 'Land Name / Title is required';
      if (!getVal('landSize', 'area_sqft') && !getVal('landSize', 'area')) errs.landSize = 'Total Land Extent is required';
      if (!getVal('soilType', 'soilType')) errs.soilType = 'Soil Type is required';
      if (!getVal('price', 'price')) errs.price = 'Price is required';
      if (!getVal('area', 'area')) errs.area = 'Taluk / District is required';
    } else if (propertyType === 'Commercial') {
      if (!getVal('propertyName', 'title')) errs.propertyName = 'Commercial Property Name is required';
      if (!getVal('commercialType', 'subcategory')) errs.commercialType = 'Commercial Space Type is required';
      if (!getVal('dimensions', 'area_sqft') && !getVal('dimensions', 'area')) errs.dimensions = 'Dimensions / Size is required';
      if (!getVal('price', 'price')) errs.price = 'Price is required';
      if (!getVal('area', 'area')) errs.area = 'Area / Location is required';
    } else if (propertyType === 'Plot/Land') {
      if (!getVal('propertyName', 'title')) errs.propertyName = 'Layout / Plot Name is required';
      if (!getVal('plotDimensions', 'area_sqft') && !getVal('plotDimensions', 'area')) errs.plotDimensions = 'Plot Dimensions are required';
      if (!getVal('approvedLayout', 'approval')) errs.approvedLayout = 'Approval Authority is required';
      if (!getVal('price', 'price')) errs.price = 'Price is required';
      if (!getVal('area', 'area')) errs.area = 'Locality / Area is required';
    } else if (propertyType === 'Industrial') {
      if (!getVal('propertyName', 'title')) errs.propertyName = 'Industrial Facility Name is required';
      if (!getVal('plotArea', 'area_sqft') && !getVal('plotArea', 'area')) errs.plotArea = 'Total Plot Area is required';
      if (!getVal('price', 'price')) errs.price = 'Price is required';
      if (!getVal('area', 'area')) errs.area = 'Industrial Zone / Area is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
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
            {(propertyType === 'Flat/Villa' || propertyType === 'Independent House') && (
              <ResidentialUnitFields propertyType={propertyType} details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {propertyType === 'Agricultural' && (
              <AgriculturalFields details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {propertyType === 'Commercial' && (
              <CommercialFields details={details} onChange={handleDetailsChange} errors={errors} />
            )}
            {propertyType === 'Plot/Land' && (
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

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
  const isPartnerLocked = partnerInfo.isLocked || Boolean(user?.partnerName && (user?.role === 'in_house' || user?.role === 'channel_partner'));
  const partnerBadge = user?.role === 'in_house' || partnerInfo.role === 'in_house'
    ? 'One Vishwam (In-House)'
    : isPartnerLocked
    ? 'Verified Channel Partner'
    : '';

  useEffect(() => {
    onPhaseChange?.(activePhase);
  }, [activePhase, onPhaseChange]);

  const vendorName = form.vendorName || '';
  const channelPartnerName = form.channelPartnerName || (isPartnerLocked ? (partnerInfo.partnerName || user?.partnerName || '') : '');
  const propertyType = form.propertyType || 'Residential';
  const bankLoanDetails = form.bankLoanDetails || '';
  const details = form.details || {};

  useEffect(() => {
    if (isPartnerLocked) {
      const assigned = partnerInfo.partnerName || user?.partnerName;
      if (assigned && form.channelPartnerName !== assigned) {
        updateForm('channelPartnerName', assigned);
      }
    }
  }, [isPartnerLocked, partnerInfo.partnerName, user?.partnerName, form.channelPartnerName, updateForm]);

  const isStep1Valid = Boolean(vendorName?.trim() && channelPartnerName?.trim() && propertyType);

  const handleRootChange = (key, val) => {
    if (key === 'channelPartnerName' && isPartnerLocked) {
      return;
    }
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

  // Phase 1 validation
  const validatePhase1 = () => {
    const errs = {};
    if (!vendorName.trim()) errs.vendorName = 'Vendor / Builder name is required';
    if (!channelPartnerName.trim()) errs.channelPartnerName = 'Channel Partner Associate is required';
    if (!propertyType) errs.propertyType = 'Please select a property category';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Phase 2 validation for the active category
  const validatePhase2 = () => {
    const errs = {};
    const d = details || {};

    if (propertyType === 'Residential') {
      if (!d.propertyName?.trim()) errs.propertyName = 'Property / Project Name is required';
      if (!d.dimensions?.trim()) errs.dimensions = 'Dimensions are required';
      if (!d.facing?.trim()) errs.facing = 'Property Facing is required';
      if (!d.cornerPlot?.trim()) errs.cornerPlot = 'Corner Plot selection is required';
      if (!d.approvedLayout?.trim()) errs.approvedLayout = 'Approved Layout is required';
      if (!d.approvalAuthority?.trim()) errs.approvalAuthority = 'Approval Authority is required';
      if (!d.expectedPrice?.trim()) errs.expectedPrice = 'Expected Price is required';
      if (!d.negotiable?.trim()) errs.negotiable = 'Negotiable selection is required';
    } else if (propertyType === 'Flat/Villa' || propertyType === 'Independent House') {
      if (!d.projectName?.trim()) errs.projectName = 'Project / Society / House Name is required';
      if (!d.bhk?.trim()) errs.bhk = 'BHK configuration is required';
      if (!d.superBuiltUpArea?.trim()) errs.superBuiltUpArea = 'Super Built-up Area is required';
      if (!d.floors?.trim()) errs.floors = 'Floor information is required';
      if (!d.facing?.trim()) errs.facing = 'Facing is required';
      if (!d.bathrooms?.trim()) errs.bathrooms = 'Number of Bathrooms is required';
      if (!d.balconies?.trim()) errs.balconies = 'Number of Balconies is required';
      if (!d.furnishing?.trim()) errs.furnishing = 'Furnishing Status is required';
      if (!d.propertyAge?.trim()) errs.propertyAge = 'Property Age is required';
      if (!d.possession?.trim()) errs.possession = 'Possession Status is required';
      if (!d.parking?.trim()) errs.parking = 'Parking Availability is required';
      if (!Array.isArray(d.amenities) || d.amenities.length === 0) errs.amenities = 'Select at least one amenity';
      if (!d.maintenance?.trim()) errs.maintenance = 'Maintenance selection is required';
      if (!d.gatedCommunity?.trim()) errs.gatedCommunity = 'Gated Community selection is required';
      if (!d.gardenTerrace?.trim()) errs.gardenTerrace = 'Garden/Terrace selection is required';
      if (!d.expectedPrice?.trim()) errs.expectedPrice = 'Expected Price is required';
      if (!d.negotiable?.trim()) errs.negotiable = 'Negotiable selection is required';
    } else if (propertyType === 'Agricultural') {
      if (!d.totalLandExtent?.trim()) errs.totalLandExtent = 'Total Land Extent is required';
      if (!d.surveyNumber?.trim()) errs.surveyNumber = 'Survey Number is required';
      if (!d.landType?.trim()) errs.landType = 'Type of Land is required';
      if (!d.roadAccess?.trim()) errs.roadAccess = 'Road Access & Width is required';
      if (!d.waterAvailability?.trim()) errs.waterAvailability = 'Water Availability is required';
      if (!d.electricity?.trim()) errs.electricity = 'Electricity selection is required';
      if (!d.currentCrop?.trim()) errs.currentCrop = 'Current Crop / Plantation is required';
      if (!d.soilType?.trim()) errs.soilType = 'Soil Type is required';
      if (!d.farmhouse?.trim()) errs.farmhouse = 'Farmhouse availability is required';
      if (!d.fencing?.trim()) errs.fencing = 'Fencing availability is required';
      if (!d.expectedPrice?.trim()) errs.expectedPrice = 'Expected Price is required';
      if (!d.negotiable?.trim()) errs.negotiable = 'Negotiable selection is required';
    } else if (propertyType === 'Commercial') {
      if (!d.commercialType?.trim()) errs.commercialType = 'Commercial Type is required';
      if (!d.carpetArea?.trim()) errs.carpetArea = 'Carpet Area is required';
      if (!d.builtUpArea?.trim()) errs.builtUpArea = 'Built-up Area is required';
      if (!d.totalFloors?.trim()) errs.totalFloors = 'Total Floors is required';
      if (!d.facing?.trim()) errs.facing = 'Property Facing is required';
      if (!d.furnishing?.trim()) errs.furnishing = 'Furnishing Status is required';
      if (!d.washrooms?.trim()) errs.washrooms = 'Washroom availability is required';
      if (!d.lift?.trim()) errs.lift = 'Lift availability is required';
      if (!d.powerBackup?.trim()) errs.powerBackup = 'Power Backup is required';
      if (!d.parkingCapacity?.trim()) errs.parkingCapacity = 'Parking Capacity is required';
      if (!d.mainRoadFrontage?.trim()) errs.mainRoadFrontage = 'Main-Road Frontage is required';
      if (!d.occupancyStatus?.trim()) errs.occupancyStatus = 'Occupancy Status is required';
      if (!d.rentalIncome?.trim()) errs.rentalIncome = 'Rental Income is required';
      if (!d.maintenance?.trim()) errs.maintenance = 'Maintenance Charges is required';
      if (!d.expectedPrice?.trim()) errs.expectedPrice = 'Expected Price is required';
      if (!d.negotiable?.trim()) errs.negotiable = 'Negotiable selection is required';
    } else if (propertyType === 'Plot/Land') {
      if (!d.projectName?.trim()) errs.projectName = 'Project / Layout Name is required';
      if (!d.plotType?.trim()) errs.plotType = 'Plot Type is required';
      if (!d.totalLandArea?.trim()) errs.totalLandArea = 'Total Land Area is required';
      if (!d.plotDimensions?.trim()) errs.plotDimensions = 'Plot Dimensions are required';
      if (!d.plotFacing?.trim()) errs.plotFacing = 'Plot Facing is required';
      if (!d.cornerPlot?.trim()) errs.cornerPlot = 'Corner Plot selection is required';
      if (!d.roadFrontage?.trim()) errs.roadFrontage = 'Road Frontage is required';
      if (!d.adjoiningRoads?.trim()) errs.adjoiningRoads = 'Adjoining Roads count is required';
      if (!d.approvalAuthority?.trim()) errs.approvalAuthority = 'Approval Authority is required';
      if (!d.conversionStatus?.trim()) errs.conversionStatus = 'Conversion Status is required';
      if (!d.boundaryFencing?.trim()) errs.boundaryFencing = 'Boundary / Fencing is required';
      if (!Array.isArray(d.utilities) || d.utilities.length === 0) errs.utilities = 'Select at least one utility';
      if (!d.expectedPrice?.trim()) errs.expectedPrice = 'Expected Price is required';
      if (!d.negotiable?.trim()) errs.negotiable = 'Negotiable selection is required';
    } else if (propertyType === 'Industrial') {
      if (!d.industrialType?.trim()) errs.industrialType = 'Industrial Type is required';
      if (!d.propertyStatus?.trim()) errs.propertyStatus = 'Property Status is required';
      if (!d.totalLandArea?.trim()) errs.totalLandArea = 'Total Land Area is required';
      if (!d.totalBuiltUpArea?.trim()) errs.totalBuiltUpArea = 'Total Built-up Area is required';
      if (!d.shedDimensions?.trim()) errs.shedDimensions = 'Shed Dimensions are required';
      if (!d.floors?.trim()) errs.floors = 'Floors count is required';
      if (!d.roadFrontage?.trim()) errs.roadFrontage = 'Road Frontage is required';
      if (!d.approachRoadWidth?.trim()) errs.approachRoadWidth = 'Approach Road Width is required';
      if (!d.heavyVehicleAccess?.trim()) errs.heavyVehicleAccess = 'Heavy Vehicle Access is required';
      if (!d.powerLoad?.trim()) errs.powerLoad = 'Power Load selection is required';
      if (!Array.isArray(d.waterAvailability) || d.waterAvailability.length === 0) errs.waterAvailability = 'Select at least one water source';
      if (!d.approvalZone?.trim()) errs.approvalZone = 'Approval Zone is required';
      if (!d.pollutionApproval?.trim()) errs.pollutionApproval = 'Pollution Approval is required';
      if (!d.fireSafetyApproval?.trim()) errs.fireSafetyApproval = 'Fire Safety Approval is required';
      if (!d.officeSpace?.trim()) errs.officeSpace = 'Office Space availability is required';
      if (!d.labourQuarters?.trim()) errs.labourQuarters = 'Labour Quarters availability is required';
      if (!d.loadingArea?.trim()) errs.loadingArea = 'Loading Area availability is required';
      if (!d.parkingCapacity?.trim()) errs.parkingCapacity = 'Parking Capacity is required';
      if (!d.suitableIndustries?.trim()) errs.suitableIndustries = 'Suitable Industries is required';
      if (!d.expectedPrice?.trim()) errs.expectedPrice = 'Expected Price is required';
      if (!d.negotiable?.trim()) errs.negotiable = 'Negotiable selection is required';
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
            isPartnerLocked={isPartnerLocked}
            partnerBadge={partnerBadge}
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

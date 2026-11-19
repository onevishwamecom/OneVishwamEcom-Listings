import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/store/authSlice';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { getCategoryConfig, normalizeCategoryKey } from '@/config/listingConfig';
import { SUBCATEGORY_CARDS, SUBCATEGORIES, EV_SUBCATEGORIES } from '../constants';
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
  onMovePhoto,
  onClearPhotos,
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

  const listerName = user?.name || user?.fullName || 'Verified Lister';
  const resolvedPartnerName = isOneVishwam ? 'One Vishwam' : (user?.partnerName || listerName);
  const resolvedVendorName = isOneVishwam ? 'One Vishwam' : (user?.vendorName || listerName);
  const displayName = isOneVishwam ? 'One Vishwam' : (form.channelPartnerName || form.vendorName || listerName);

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

  const isVehicleCategory = category === 'vehicle' || category === 'vehicles';
  const isElectricVehicle =
    isVehicleCategory &&
    (selectedSubcategory === 'Electric Vehicle' ||
      form.subcategory === 'Electric Vehicle' ||
      String(form.subcategory || '').startsWith('Electric') ||
      form.fuelType === 'Electric' ||
      Boolean(form.evType));

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

  // BUG-016: If user chooses the electric option, the fuel type must be electric by default
  useEffect(() => {
    if (isVehicleCategory && isElectricVehicle) {
      if (!form.fuelType || (form.fuelType !== 'Electric' && form.fuelType !== 'Hybrid' && form.fuelType !== 'Plug-in Hybrid')) {
        updateForm('fuelType', 'Electric');
      }
      if (!form.transmission || form.transmission === 'Manual') {
        updateForm('transmission', 'Automatic (Single-Speed EV)');
      }
    }
  }, [isVehicleCategory, isElectricVehicle, form.fuelType, form.transmission, updateForm]);

  const handleSelectSubcategory = (subId) => {
    updateForm('subcategory', subId);
    if (isVehicleCategory) {
      if (subId === 'Electric Vehicle') {
        const defaultEv = EV_SUBCATEGORIES[0];
        updateForm('evType', defaultEv.id);
        updateForm('fuelType', 'Electric');
        updateForm('transmission', 'Automatic (Single-Speed EV)');
        updateForm('categoryVehicle', defaultEv.categoryVehicle);
        updateForm('wheelerType', defaultEv.wheelerType);
        updateForm('bodyType', defaultEv.defaultBodyType);
      } else if (subId === 'Bike') {
        updateForm('evType', '');
        updateForm('fuelType', 'Petrol');
        updateForm('categoryVehicle', '2-Wheeler');
        updateForm('wheelerType', '2-wheeler');
        updateForm('bodyType', 'Motorcycle / Bike');
        updateForm('transmission', 'Manual');
      } else if (subId === 'Car') {
        updateForm('evType', '');
        updateForm('fuelType', 'Petrol');
        updateForm('categoryVehicle', '4-Wheeler');
        updateForm('wheelerType', '4-wheeler');
        updateForm('bodyType', 'Hatchback');
        updateForm('transmission', 'Manual');
      } else if (subId === 'Commercial Vehicle') {
        updateForm('evType', '');
        updateForm('fuelType', 'Diesel');
        updateForm('categoryVehicle', 'Commercial');
        updateForm('wheelerType', 'commercial');
        updateForm('bodyType', 'Mini Truck / Pickup');
        updateForm('transmission', 'Manual');
      } else if (subId === 'Auto Rickshaw') {
        updateForm('evType', '');
        updateForm('fuelType', 'CNG');
        updateForm('categoryVehicle', '3-Wheeler');
        updateForm('wheelerType', '3-wheeler');
        updateForm('bodyType', 'Passenger Auto');
        updateForm('transmission', 'Manual');
      } else {
        updateForm('categoryVehicle', subId);
      }
    }
    setLocalErrors((prev) => {
      const next = { ...prev };
      delete next.subcategory;
      return next;
    });
  };

  const handleSelectEvType = (ev) => {
    updateForm('evType', ev.id);
    updateForm('subcategory', 'Electric Vehicle');
    updateForm('fuelType', 'Electric');
    updateForm('transmission', 'Automatic (Single-Speed EV)');
    updateForm('categoryVehicle', ev.categoryVehicle);
    updateForm('wheelerType', ev.wheelerType);
    updateForm('bodyType', ev.defaultBodyType);
  };

  const activeFields = useMemo(() => {
    if (!isVehicleCategory) return catFields;

    return catFields
      .map((field) => {
        if (field.name === 'fuelType') {
          if (isElectricVehicle) {
            return {
              ...field,
              label: 'Fuel Type',
              options: ['Electric', 'Hybrid', 'Plug-in Hybrid'],
            };
          }
          return field;
        }

        if (field.name === 'transmission') {
          if (isElectricVehicle) {
            return {
              ...field,
              label: 'Drive / Transmission',
              options: ['Automatic (Single-Speed EV)', 'Automatic'],
            };
          }
          if (selectedSubcategory === 'Bike') {
            return {
              ...field,
              options: ['Manual', 'Automatic / CVT (Scooter)'],
            };
          }
          return field;
        }

        if (field.name === 'mileage') {
          if (isElectricVehicle) {
            return {
              ...field,
              label: 'Battery Range per Full Charge',
              placeholder: 'e.g. 315 km / full charge (ARAI) or 465 km',
            };
          }
          return field;
        }

        if (field.name === 'bodyType') {
          if (isElectricVehicle) {
            const currentEv = EV_SUBCATEGORIES.find((e) => e.id === form.evType) || EV_SUBCATEGORIES[0];
            return {
              ...field,
              label: 'Body Type / Style',
              options: currentEv.bodyTypes || ['SUV', 'Sedan', 'Hatchback', 'Electric Scooter'],
            };
          }
          if (selectedSubcategory === 'Bike') {
            return {
              ...field,
              label: 'Vehicle Style / Type',
              options: ['Motorcycle / Bike', 'Scooter', 'Cruiser', 'Sports Bike', 'Commuter', 'Moped'],
            };
          }
          if (selectedSubcategory === 'Commercial Vehicle') {
            return {
              ...field,
              label: 'Commercial Body Type',
              options: ['Mini Truck / Pickup', 'Cargo Van', 'Heavy Truck', 'Tipper', 'Bus / Mini Bus'],
            };
          }
          if (selectedSubcategory === 'Auto Rickshaw') {
            return {
              ...field,
              label: '3-Wheeler Type',
              options: ['Passenger Auto', 'Cargo Auto / Delivery', 'E-Rickshaw'],
            };
          }
          return {
            ...field,
            options: ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Coupe', 'Luxury / Sports'],
          };
        }

        return field;
      })
      .filter((field) => {
        if ((field.name === 'batteryCapacity' || field.name === 'chargingTime') && !isElectricVehicle) {
          return false;
        }
        return true;
      });
  }, [isVehicleCategory, isElectricVehicle, catFields, selectedSubcategory, form.evType]);

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
                    {sub.subtitle && (
                      <span className="text-[10px] text-slate-400 mt-1 line-clamp-1 hidden sm:block">{sub.subtitle}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Dedicated EV Classification Sub-Selector */}
            {isVehicleCategory && selectedSubcategory === 'Electric Vehicle' && (
              <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      <i className="fa-solid fa-bolt" />
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      Choose Electric Vehicle (EV) Type
                    </h3>
                    <span className="text-red-500 text-xs">*</span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80 self-start sm:self-auto">
                    Smart EV presets enabled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {EV_SUBCATEGORIES.map((ev) => {
                    const isEvSelected = (form.evType || 'Electric Car') === ev.id;
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => handleSelectEvType(ev)}
                        className={`flex flex-col items-start p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isEvSelected
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-950 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-slate-200/90 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-1.5">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                            isEvSelected ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                          }`}>
                            <i className={`fa-solid ${ev.icon}`} />
                          </div>
                          {isEvSelected && (
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                              Selected
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-slate-900 line-clamp-1">{ev.label}</span>
                        <span className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{ev.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
                  id="listing-title"
                  name="listingTitle"
                  label="Listing Title / Headline"
                  autoComplete="off"
                  required
                  placeholder={
                    category === 'vehicle' || category === 'vehicles'
                      ? 'Enter vehicle title or headline (e.g. 2024 Tata Nexon EV · Bangalore)'
                      : category === 'groceries'
                      ? 'Enter product title (e.g. Premium Organic Sona Masoori Rice - 25 Kg Pack)'
                      : 'Enter listing title or headline'
                  }
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
          {activeFields.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <i className="fa-solid fa-list-check text-cyan-600" />
                  <span>{categoryMeta.label} Specifications</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Key attributes and equipment</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeFields.map((field) => (
                  <div key={field.name} className={field.colSpan === 2 ? 'sm:col-span-2' : ''}>
                    {field.type === 'select' ? (
                      <Select
                        label={field.label}
                        required={field.required}
                        value={
                          field.name === 'fuelType' && isElectricVehicle
                            ? (form.fuelType === 'Hybrid' || form.fuelType === 'Plug-in Hybrid' ? form.fuelType : 'Electric')
                            : (form[field.name] || '')
                        }
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
          onMovePhoto={onMovePhoto}
          onClearPhotos={onClearPhotos}
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

import React from 'react';
import RadioGroupWithOther from './RadioGroupWithOther';

export default function AgriculturalFields({
  details = {},
  onChange,
  errors = {},
}) {
  const update = (key, val) => onChange(key, val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group 1: Land Identity & Extent */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Land Extent & Survey Details</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Acreage, government survey numbers, and legal agricultural classification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Land Extent */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Total Land Extent (Acres / Guntas) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.totalLandExtent || ''}
              onChange={(e) => update('totalLandExtent', e.target.value)}
              placeholder="e.g. 4 Acres 20 Guntas"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.totalLandExtent
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.totalLandExtent && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.totalLandExtent}</p>
            )}
          </div>

          {/* Survey Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Survey Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.surveyNumber || ''}
              onChange={(e) => update('surveyNumber', e.target.value)}
              placeholder="e.g. Sy No. 124/2B"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.surveyNumber
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.surveyNumber && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.surveyNumber}</p>
            )}
          </div>

          {/* Type of Land */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Type of Land"
              name="landType"
              options={['Agricultural', 'Converted', 'Plantation', 'Farm land', 'Other']}
              value={details.landType || ''}
              onChange={(val) => update('landType', val)}
              required
              error={errors.landType}
              otherPlaceholder="Specify land type"
            />
          </div>
        </div>
      </div>

      {/* Group 2: Access & Infrastructure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Access & Utilities Infrastructure</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Approach roads, water sources, electricity power, and fencing protections
          </p>
        </div>

        <div className="space-y-4">
          {/* Road Access and Width */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Road Access & Road Width <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.roadAccess || ''}
              onChange={(e) => update('roadAccess', e.target.value)}
              placeholder="e.g. Tar Road with 30 ft width frontage"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.roadAccess
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.roadAccess && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.roadAccess}</p>
            )}
          </div>

          {/* Water Availability */}
          <div>
            <RadioGroupWithOther
              label="Water Availability"
              name="waterAvailability"
              options={['Borewell', 'Lake', 'Rain-fed', 'Canal', 'None', 'Other']}
              value={details.waterAvailability || ''}
              onChange={(val) => update('waterAvailability', val)}
              required
              error={errors.waterAvailability}
              otherPlaceholder="Specify water source"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {/* Electricity Available? */}
            <div>
              <RadioGroupWithOther
                label="Electricity Available?"
                name="electricity"
                options={['Yes', 'No']}
                value={details.electricity || ''}
                onChange={(val) => update('electricity', val)}
                required
                error={errors.electricity}
              />
            </div>

            {/* Farmhouse or structures */}
            <div>
              <RadioGroupWithOther
                label="Farmhouse / Shed Available?"
                name="farmhouse"
                options={['Yes', 'No']}
                value={details.farmhouse || ''}
                onChange={(val) => update('farmhouse', val)}
                required
                error={errors.farmhouse}
              />
            </div>

            {/* Fencing/boundary */}
            <div>
              <RadioGroupWithOther
                label="Fencing / Boundary Wall?"
                name="fencing"
                options={['Yes', 'No']}
                value={details.fencing || ''}
                onChange={(val) => update('fencing', val)}
                required
                error={errors.fencing}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Group 3: Agronomic & Soil Profile */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Crop Plantation & Soil Quality</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Current harvest yield, tree count, and soil classification
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Current Crop */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Current Crop / Plantation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.currentCrop || ''}
              onChange={(e) => update('currentCrop', e.target.value)}
              placeholder="e.g. Coconut, Arecanut, Mango, Fallow"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.currentCrop
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.currentCrop && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.currentCrop}</p>
            )}
          </div>

          {/* Soil Type */}
          <div>
            <RadioGroupWithOther
              label="Soil Type"
              name="soilType"
              options={['Red Soil', 'Black Soil', 'Other']}
              value={details.soilType || ''}
              onChange={(val) => update('soilType', val)}
              required
              error={errors.soilType}
              otherPlaceholder="Specify soil type (e.g. Sandy Loam)"
            />
          </div>
        </div>
      </div>

      {/* Group 4: Pricing & Terms */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Commercial Terms & Valuation</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Expected rate per acre or gross valuation, and price flexibility
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Expected Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expected Price per Acre / Total Price <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.expectedPrice || ''}
              onChange={(e) => update('expectedPrice', e.target.value)}
              placeholder="e.g. ₹45 Lakhs / Acre or ₹1.8 Cr Total"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.expectedPrice
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.expectedPrice && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.expectedPrice}</p>
            )}
          </div>

          {/* Negotiable? */}
          <div>
            <RadioGroupWithOther
              label="Price Negotiable?"
              name="negotiable"
              options={['Yes', 'No']}
              value={details.negotiable || ''}
              onChange={(val) => update('negotiable', val)}
              required
              error={errors.negotiable}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

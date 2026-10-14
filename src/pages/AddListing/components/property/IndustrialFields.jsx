import React from 'react';
import RadioGroupWithOther from './RadioGroupWithOther';
import PossessionStatusSelector from './PossessionStatusSelector';
import CheckboxGroupWithOther from './CheckboxGroupWithOther';

const INDUSTRIAL_WATER_OPTIONS = [
  'Borewell',
  'Government connection',
  'Tanker supply',
  'Not available',
  'Other',
];

export default function IndustrialFields({
  details = {},
  onChange,
  errors = {},
}) {
  const update = (key, val) => onChange(key, val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group 1: Facility Overview & Built Specifications */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Facility Overview & Built Specifications</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Plant classification, current operational status, land area, and shed measurements
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Type of Industrial Property */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Type of Industrial Property"
              name="industrialType"
              options={[
                'Industrial land',
                'Factory',
                'Warehouse',
                'Industrial shed',
                'Manufacturing unit',
                'Logistics facility',
                'Cold storage',
                'Other',
              ]}
              value={details.industrialType || ''}
              onChange={(val) => update('industrialType', val)}
              required
              error={errors.industrialType}
              otherPlaceholder="Specify industrial type"
            />
          </div>

          {/* Property Status */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Property Status"
              name="propertyStatus"
              options={[
                'Vacant land',
                'Ready to occupy',
                'Operational',
                'Under construction',
                'Closed/non-operational',
                'Other',
              ]}
              value={details.propertyStatus || ''}
              onChange={(val) => update('propertyStatus', val)}
              required
              error={errors.propertyStatus}
              otherPlaceholder="Specify property status"
            />
          </div>

          {/* Possession Status */}
          <div className="md:col-span-2">
            <PossessionStatusSelector
              propertyType="Industrial"
              value={details.possessionStatus || details.possession || ""}
              onChange={(val) => {
                update("possessionStatus", val);
                update("possession", val);
              }}
              error={errors.possessionStatus || errors.possession}
              required={false}
            />
          </div>

          {/* Total Land Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Total Land Area <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.totalLandArea || ''}
              onChange={(e) => update('totalLandArea', e.target.value)}
              placeholder="e.g. 2 Acres or 45,000 sq.ft."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.totalLandArea
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.totalLandArea && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.totalLandArea}</p>
            )}
          </div>

          {/* Total Built-up Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Total Built-up Area <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.totalBuiltUpArea || ''}
              onChange={(e) => update('totalBuiltUpArea', e.target.value)}
              placeholder="e.g. 25,000 sq.ft."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.totalBuiltUpArea
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.totalBuiltUpArea && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.totalBuiltUpArea}</p>
            )}
          </div>

          {/* Shed/Factory Dimensions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Shed / Factory Dimensions <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.shedDimensions || ''}
              onChange={(e) => update('shedDimensions', e.target.value)}
              placeholder="e.g. 100 x 200 ft (Height: 28 ft)"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.shedDimensions
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.shedDimensions && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.shedDimensions}</p>
            )}
          </div>

          {/* Number of Floors */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Number of Floors (if any) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.floors || ''}
              onChange={(e) => update('floors', e.target.value)}
              placeholder="e.g. Ground Floor only / G+1 Mezzanine"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.floors
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.floors && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.floors}</p>
            )}
          </div>
        </div>
      </div>

      {/* Group 2: Access & Logistics Infrastructure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Logistics & Heavy Transport Access</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Container trailer accessibility, road widths, electrical power load, and water
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Approach Road Width */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Approach Road Width <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={details.approachRoadWidth || ''}
                onChange={(e) => update('approachRoadWidth', e.target.value)}
                placeholder="e.g. 60 ft or 80 ft Main Road"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                  errors.approachRoadWidth
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
                }`}
              />
              {errors.approachRoadWidth && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.approachRoadWidth}</p>
              )}
            </div>

            {/* Road Frontage */}
            <div>
              <RadioGroupWithOther
                label="Road Frontage Available?"
                name="roadFrontage"
                options={['Yes', 'No']}
                value={details.roadFrontage || ''}
                onChange={(val) => update('roadFrontage', val)}
                required
                error={errors.roadFrontage}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Heavy Vehicle Access */}
            <div>
              <RadioGroupWithOther
                label="Can Heavy Vehicles / Containers Access?"
                name="heavyVehicleAccess"
                options={['Yes', 'No']}
                value={details.heavyVehicleAccess || ''}
                onChange={(val) => update('heavyVehicleAccess', val)}
                required
                error={errors.heavyVehicleAccess}
              />
            </div>

            {/* Power Load */}
            <div>
              <RadioGroupWithOther
                label="Power Availability / Sanctioned Load?"
                subtext="e.g. 100 kVA or 500 HP"
                name="powerLoad"
                options={['Yes', 'No']}
                value={details.powerLoad || ''}
                onChange={(val) => update('powerLoad', val)}
                required
                error={errors.powerLoad}
              />
            </div>
          </div>

          {/* Water Availability */}
          <div className="pt-1">
            <CheckboxGroupWithOther
              label="Water Sources Available"
              options={INDUSTRIAL_WATER_OPTIONS}
              values={details.waterAvailability || []}
              onChange={(val) => update('waterAvailability', val)}
              required
              error={errors.waterAvailability}
              otherPlaceholder="Specify custom water source..."
            />
          </div>
        </div>
      </div>

      {/* Group 3: Approvals, On-Site Amenities & Compliance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Clearances, Amenities & Industry Suitability</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Government zoning, environmental NOCs, on-site office/labour facilities, and suitable industries
          </p>
        </div>

        <div className="space-y-4">
          {/* Industrial Approval Zone */}
          <div>
            <RadioGroupWithOther
              label="Industrial Approval / Zone"
              name="approvalZone"
              options={['KIADB', 'KSSIDC', 'Industrially converted', 'Private industrial area', 'Other']}
              value={details.approvalZone || ''}
              onChange={(val) => update('approvalZone', val)}
              required
              error={errors.approvalZone}
              otherPlaceholder="Specify industrial zone"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {/* Pollution Control */}
            <div>
              <RadioGroupWithOther
                label="Pollution-Control Approval Available?"
                name="pollutionApproval"
                options={['Yes', 'No', 'Not applicable']}
                value={details.pollutionApproval || ''}
                onChange={(val) => update('pollutionApproval', val)}
                required
                error={errors.pollutionApproval}
              />
            </div>

            {/* Fire Safety */}
            <div>
              <RadioGroupWithOther
                label="Fire-Safety Approval Available?"
                name="fireSafetyApproval"
                options={['Yes', 'No', 'Not applicable']}
                value={details.fireSafetyApproval || ''}
                onChange={(val) => update('fireSafetyApproval', val)}
                required
                error={errors.fireSafetyApproval}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Office Space */}
            <div>
              <RadioGroupWithOther
                label="Office Space Available?"
                name="officeSpace"
                options={['Yes', 'No']}
                value={details.officeSpace || ''}
                onChange={(val) => update('officeSpace', val)}
                required
                error={errors.officeSpace}
              />
            </div>

            {/* Labour Quarters */}
            <div>
              <RadioGroupWithOther
                label="Labour Quarters Available?"
                name="labourQuarters"
                options={['Yes', 'No']}
                value={details.labourQuarters || ''}
                onChange={(val) => update('labourQuarters', val)}
                required
                error={errors.labourQuarters}
              />
            </div>

            {/* Loading Area */}
            <div>
              <RadioGroupWithOther
                label="Loading / Unloading Bay?"
                name="loadingArea"
                options={['Yes', 'No']}
                value={details.loadingArea || ''}
                onChange={(val) => update('loadingArea', val)}
                required
                error={errors.loadingArea}
              />
            </div>
          </div>

          {/* Parking Capacity */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Parking Capacity <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.parkingCapacity || ''}
              onChange={(e) => update('parkingCapacity', e.target.value)}
              placeholder="e.g. 5 Trucks / 20 Cars & Bikes"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.parkingCapacity
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.parkingCapacity && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.parkingCapacity}</p>
            )}
          </div>

          {/* Suitable for Which Industries? */}
          <div className="pt-1">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Suitable for Which Industries? <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.suitableIndustries || ''}
              onChange={(e) => update('suitableIndustries', e.target.value)}
              placeholder="e.g. Light Engineering, Pharma, E-commerce Logistics, Auto Components"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.suitableIndustries
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.suitableIndustries && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.suitableIndustries}</p>
            )}
          </div>
        </div>
      </div>

      {/* Group 4: Commercial Terms & Pricing */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Commercial Terms & Pricing</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Expected outright sale valuation or monthly lease rent with negotiation terms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Expected Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expected Sale Price / Rent <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.expectedPrice || ''}
              onChange={(e) => update('expectedPrice', e.target.value)}
              placeholder="e.g. ₹6.5 Cr or ₹4,50,000 / month"
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

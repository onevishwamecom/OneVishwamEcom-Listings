import React from 'react';
import RadioGroupWithOther from './RadioGroupWithOther';
import PossessionStatusSelector from './PossessionStatusSelector';

export default function CommercialFields({
  details = {},
  onChange,
  errors = {},
}) {
  const update = (keyOrObj, val) => typeof keyOrObj === "object" && keyOrObj !== null ? onChange(keyOrObj) : onChange(keyOrObj, val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group 1: Commercial Space & Structure */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Space Type & Built Area</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Commercial classification, floor plan measurements, and vertical structure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Commercial Property Type */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Commercial Property Type"
              name="commercialType"
              options={['Office', 'Shop', 'Showroom', 'Restaurant space', 'Commercial building', 'Warehouse', 'Other']}
              value={details.commercialType || ''}
              onChange={(val) => update('commercialType', val)}
              required
              error={errors.commercialType}
              otherPlaceholder="Specify commercial type"
            />
          </div>

          {/* Carpet Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Carpet Area (sq. ft.) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.carpetArea || ''}
              onChange={(e) => update('carpetArea', e.target.value)}
              placeholder="e.g. 2,200 sq.ft."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.carpetArea
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.carpetArea && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.carpetArea}</p>
            )}
          </div>

          {/* Built-up Area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Built-up Area (sq. ft.) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.builtUpArea || ''}
              onChange={(e) => update('builtUpArea', e.target.value)}
              placeholder="e.g. 2,800 sq.ft."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.builtUpArea
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.builtUpArea && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.builtUpArea}</p>
            )}
          </div>

          {/* Total Number of Floors */}
          <div>
            <RadioGroupWithOther
              label="Total Floors in Building"
              name="totalFloors"
              options={['0', '1', '2', '3', 'Other']}
              value={details.totalFloors || ''}
              onChange={(val) => update('totalFloors', val)}
              required
              error={errors.totalFloors}
              otherPlaceholder="e.g. 4 Floors, G+4 Floors, or 10 Floors"
            />
          </div>

          {/* Property Facing */}
          <div>
            <RadioGroupWithOther
              label="Property Facing"
              name="facing"
              options={['North', 'South', 'East', 'West', 'Other']}
              value={details.facing || ''}
              onChange={(val) => update('facing', val)}
              required
              error={errors.facing}
              otherPlaceholder="Specify custom facing"
            />
          </div>
        </div>
      </div>

      {/* Group 2: Facilities, Access & Parking */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Facilities & Access Infrastructure</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Elevator access, electricity backup, parking bays, and street frontage
          </p>
        </div>

        <div className="space-y-4">
          {/* Furnishing Status */}
          <div>
            <RadioGroupWithOther
              label="Furnishing / Interior Status"
              name="furnishing"
              options={['Semi Furnished', 'Fully Furnished', 'No Furnishing']}
              value={details.furnishing || ''}
              onChange={(val) => update('furnishing', val)}
              required
              error={errors.furnishing}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Washrooms */}
            <div>
              <RadioGroupWithOther
                label="Washrooms Available"
                name="washrooms"
                options={['Yes', 'No']}
                value={details.washrooms || ''}
                onChange={(val) => update('washrooms', val)}
                required
                error={errors.washrooms}
              />
            </div>

            {/* Lift */}
            <div>
              <RadioGroupWithOther
                label="Lift Available"
                name="lift"
                options={['Yes', 'No']}
                value={details.lift || ''}
                onChange={(val) => update('lift', val)}
                required
                error={errors.lift}
              />
            </div>

            {/* Power Backup */}
            <div>
              <RadioGroupWithOther
                label="Power Backup Available"
                name="powerBackup"
                options={['Yes', 'No']}
                value={details.powerBackup || ''}
                onChange={(val) => update('powerBackup', val)}
                required
                error={errors.powerBackup}
              />
            </div>
          </div>

          {/* Parking Capacity */}
          <div className="pt-1">
            <RadioGroupWithOther
              label="Parking Capacity"
              name="parkingCapacity"
              options={['None', 'Two wheelers', 'Few Four wheelers', 'Other']}
              value={details.parkingCapacity || ''}
              onChange={(val) => update('parkingCapacity', val)}
              required
              error={errors.parkingCapacity}
              otherPlaceholder="Specify parking capacity (e.g. 25 cars, basement parking)"
            />
          </div>

          {/* Main Road Frontage */}
          <div className="pt-1">
            <RadioGroupWithOther
              label="Main-Road Frontage"
              name="mainRoadFrontage"
              options={['Yes', 'No', 'Other']}
              value={details.mainRoadFrontage || ''}
              onChange={(val) => update('mainRoadFrontage', val)}
              required
              error={errors.mainRoadFrontage}
              otherPlaceholder="Specify frontage details (e.g. 60 ft frontage on main road)"
            />
          </div>
        </div>
      </div>

      {/* Group 3: Financials, Tenancy & Pricing */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Financials, Tenancy & Pricing</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Current occupancy status, active rental income, maintenance, and sale/lease terms
          </p>
        </div>

        <div className="space-y-4">
          <div className="pt-1">
            <PossessionStatusSelector
              propertyType="Commercial"
              value={details.possessionStatus || details.possession || ""}
              onChange={(val) => update({ possessionStatus: val, possession: val })}
              error={errors.possessionStatus || errors.possession}
              required={false}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Occupancy Status */}
            <div>
              <RadioGroupWithOther
                label="Currently Occupied or Vacant?"
                name="occupancyStatus"
                options={['occupied', 'Vacant', 'Other']}
                value={details.occupancyStatus || ''}
                onChange={(val) => update('occupancyStatus', val)}
                required
                error={errors.occupancyStatus}
                otherPlaceholder="Specify occupancy status"
              />
            </div>

            {/* Existing Rental Income */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Existing Rental Income (if applicable) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={details.rentalIncome || ''}
                onChange={(e) => update('rentalIncome', e.target.value)}
                placeholder="e.g. ₹1,50,000 / month (or 'N/A')"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                  errors.rentalIncome
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
                }`}
              />
              {errors.rentalIncome && (
                <p className="text-[11px] font-medium text-red-500 mt-1">{errors.rentalIncome}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1 items-start">
            {/* Maintenance charges */}
            <div>
              <RadioGroupWithOther
                label="Maintenance Charges Applicable?"
                name="maintenance"
                options={['Yes', 'No']}
                value={details.maintenance || ''}
                onChange={(val) => update('maintenance', val)}
                required
                error={errors.maintenance}
              />
            </div>

            {/* Expected Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Expected Sale Price / Rent <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={details.expectedPrice || ''}
                onChange={(e) => update('expectedPrice', e.target.value)}
                placeholder="e.g. ₹2.5 Cr or ₹2,00,000 / month"
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
    </div>
  );
}

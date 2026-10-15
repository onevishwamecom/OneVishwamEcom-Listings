import React from 'react';
import RadioGroupWithOther from './RadioGroupWithOther';
import CheckboxGroupWithOther from './CheckboxGroupWithOther';
import PossessionStatusSelector from './PossessionStatusSelector';

const AMENITIES_OPTIONS = [
  'Lift',
  'Power backup',
  'Security/CCTV',
  'Swimming pool',
  'Gym',
  'Clubhouse',
  "Children's play area",
  'Garden',
  'Community hall',
  'Other',
];

export default function ResidentialUnitFields({
  details = {},
  onChange,
  errors = {},
  propertyType = 'Flat/Villa',
}) {
  const update = (keyOrObj, val) => typeof keyOrObj === "object" && keyOrObj !== null ? onChange(keyOrObj) : onChange(keyOrObj, val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group 1: Unit Configuration & Space */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">
            {propertyType === 'Independent House' ? 'House' : 'Unit'} Specifications & Layout
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Project name, BHK configuration, floor level, and room dimensions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project/Apartment Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Project / Society / House Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.projectName || ''}
              onChange={(e) => update('projectName', e.target.value)}
              placeholder="e.g. Sobha Dream Acres / Prestige Golfshire"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.projectName
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.projectName && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.projectName}</p>
            )}
          </div>

          {/* How many BHK? */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Configuration (BHK)"
              name="bhk"
              options={['1 RK', '1 BHK', '2 BHK', '3 BHK', 'Other']}
              value={details.bhk || ''}
              onChange={(val) => update('bhk', val)}
              required
              error={errors.bhk}
              otherPlaceholder="Specify custom configuration (e.g. 4 BHK, 5 BHK, Duplex)"
            />
          </div>

          {/* Super built-up area */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Super Built-up Area (sq. ft.) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.superBuiltUpArea || ''}
              onChange={(e) => update('superBuiltUpArea', e.target.value)}
              placeholder="e.g. 1,450 sq.ft."
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.superBuiltUpArea
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.superBuiltUpArea && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.superBuiltUpArea}</p>
            )}
          </div>

          {/* Floor & Floors/Blocks */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Floor
            </label>
            <input
              type="text"
              value={details.floor || ''}
              onChange={(e) => update('floor', e.target.value)}
              placeholder="e.g. 20th of 20 Floors"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue hover:border-slate-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Floors / Blocks <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.floors || ''}
              onChange={(e) => update('floors', e.target.value)}
              placeholder="e.g. B+G+11 Floors · 3 Towers · 6 Blocks"
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

          {/* Towers & Extra Room */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Towers
            </label>
            <input
              type="text"
              value={details.towers || ''}
              onChange={(e) => update('towers', e.target.value)}
              placeholder="e.g. 3 Towers"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue hover:border-slate-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Extra Room
            </label>
            <input
              type="text"
              value={details.extraRoom || ''}
              onChange={(e) => update('extraRoom', e.target.value)}
              placeholder="e.g. Pooja Room, Study"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue hover:border-slate-300 transition-all"
            />
          </div>

          {/* Project & Unit Counts */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Total Projects
            </label>
            <input
              type="number"
              value={details.projectCount || ''}
              onChange={(e) => update('projectCount', e.target.value)}
              placeholder="e.g. 120"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue hover:border-slate-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Total Units
            </label>
            <input
              type="text"
              value={details.totalUnits || ''}
              onChange={(e) => update('totalUnits', e.target.value)}
              placeholder="e.g. 200 Units"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue hover:border-slate-300 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Available Units
            </label>
            <input
              type="number"
              value={details.availableUnits || ''}
              onChange={(e) => update('availableUnits', e.target.value)}
              placeholder="e.g. 5"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-xs bg-white outline-none focus:border-brand-blue hover:border-slate-300 transition-all"
            />
          </div>

          {/* Approval Authority */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Approval Authority"
              name="approvalAuthority"
              options={['BDA', 'BBMP', 'BMRDA', 'RERA', 'EOI', 'Other']}
              value={details.approvalAuthority || details.approval || ''}
              onChange={(val) => {
                update('approvalAuthority', val);
                update('approval', val);
              }}
              otherPlaceholder="Specify approval authority (e.g. DTCP / DC Converted)"
            />
          </div>

          {/* Bank Loan Approved */}
          <div>
            <RadioGroupWithOther
              label="Bank Loan Approved"
              name="bankLoanApproved"
              options={['Yes', 'No']}
              value={details.bankLoanApproved || (details.loanApproved ? 'Yes' : '')}
              onChange={(val) => {
                update('bankLoanApproved', val);
                update('loanApproved', val === 'Yes');
              }}
            />
          </div>

          {/* Property Facing */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Property Facing"
              name="facing"
              options={['North', 'South', 'East', 'West', 'Other']}
              value={details.facing || ''}
              onChange={(val) => update('facing', val)}
              required
              error={errors.facing}
              otherPlaceholder="Specify custom facing (e.g. North-East)"
            />
          </div>

          {/* Number of Bathrooms */}
          <div>
            <RadioGroupWithOther
              label="Bathrooms"
              name="bathrooms"
              options={['1', '2', 'Other']}
              value={details.bathrooms || ''}
              onChange={(val) => update('bathrooms', val)}
              required
              error={errors.bathrooms}
              otherPlaceholder="e.g. 3, 4, 5+"
            />
          </div>

          {/* Number of Balconies */}
          <div>
            <RadioGroupWithOther
              label="Balconies"
              name="balconies"
              options={['1', '2', 'Other']}
              value={details.balconies || ''}
              onChange={(val) => update('balconies', val)}
              required
              error={errors.balconies}
              otherPlaceholder="e.g. 3 or None"
            />
          </div>
        </div>
      </div>

      {/* Group 2: Furnishing & Living Status */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Furnishing & Living Status</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Interior fitouts, handover timeline, age of construction, and vehicle parking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Furnishing status */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Furnishing Status"
              name="furnishing"
              options={['Unfurnished', 'Semi-furnished', 'Fully furnished']}
              value={details.furnishing || ''}
              onChange={(val) => update('furnishing', val)}
              required
              error={errors.furnishing}
            />
          </div>

          {/* Possession status */}
          <div className="md:col-span-2">
            <PossessionStatusSelector
              propertyType={propertyType}
              value={details.possessionStatus || details.possession || ""}
              onChange={(val) => update({ possessionStatus: val, possession: val })}
              error={errors.possessionStatus || errors.possession}
              required={false}
            />
          </div>

          {/* Property Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Property Age <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.propertyAge || ''}
              onChange={(e) => update('propertyAge', e.target.value)}
              placeholder="e.g. Brand New / 2 Years"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.propertyAge
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.propertyAge && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.propertyAge}</p>
            )}
          </div>

          {/* Parking availability */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Parking Space"
              name="parking"
              options={['None', 'Two Wheeler', 'one car', 'Multiple Cars', 'Other']}
              value={details.parking || ''}
              onChange={(val) => update('parking', val)}
              required
              error={errors.parking}
              otherPlaceholder="Specify parking configuration"
            />
          </div>

          {/* Gated community */}
          <div>
            <RadioGroupWithOther
              label="Gated Community?"
              name="gatedCommunity"
              options={['Yes', 'No']}
              value={details.gatedCommunity || ''}
              onChange={(val) => update('gatedCommunity', val)}
              required
              error={errors.gatedCommunity}
            />
          </div>

          {/* Garden/terrace */}
          <div>
            <RadioGroupWithOther
              label="Garden / Private Terrace"
              name="gardenTerrace"
              options={['Yes', 'No', 'Maybe']}
              value={details.gardenTerrace || ''}
              onChange={(val) => update('gardenTerrace', val)}
              required
              error={errors.gardenTerrace}
            />
          </div>
        </div>
      </div>

      {/* Group 3: Amenities & Society Charges */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Amenities & Maintenance</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Community lifestyle features, clubhouse access, and monthly maintenance policy
          </p>
        </div>

        <div className="space-y-4">
          {/* Amenities Available */}
          <div>
            <CheckboxGroupWithOther
              label="Society Amenities Available"
              options={AMENITIES_OPTIONS}
              values={details.amenities || []}
              onChange={(val) => update('amenities', val)}
              required
              error={errors.amenities}
              otherPlaceholder="Specify custom amenities..."
            />
          </div>

          {/* Maintenance charges */}
          <div className="pt-2">
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
        </div>
      </div>

      {/* Group 4: Pricing & Commercials */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Pricing & Commercial Terms</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Target valuation or expected rental yield, along with negotiation flexibility
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Expected selling price/rent */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expected Selling Price / Rent <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.expectedPrice || ''}
              onChange={(e) => update('expectedPrice', e.target.value)}
              placeholder="e.g. ₹85,00,000 or ₹35,000/month"
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

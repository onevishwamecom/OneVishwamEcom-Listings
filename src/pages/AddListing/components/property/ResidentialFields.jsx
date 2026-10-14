import React from 'react';
import RadioGroupWithOther from './RadioGroupWithOther';
import PossessionStatusSelector from './PossessionStatusSelector';

export default function ResidentialFields({
  details = {},
  onChange,
  errors = {},
}) {
  const update = (key, val) => onChange(key, val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group 1: Property Basics & Orientation */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Property Overview & Dimensions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Basic project name, plot measurements, and directional orientation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Property/Project Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Property / Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.propertyName || ''}
              onChange={(e) => update('propertyName', e.target.value)}
              placeholder="e.g. Green Meadows Residential Layout"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.propertyName
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.propertyName && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.propertyName}</p>
            )}
          </div>

          {/* Property dimensions */}
          <div className="md:col-span-2">
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Dimensions: Length x Width <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-normal">Total property area in sq.ft.</span>
            </div>
            <input
              type="text"
              value={details.dimensions || ''}
              onChange={(e) => update('dimensions', e.target.value)}
              placeholder="e.g. 30 x 40 ft (1,200 sq.ft.)"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.dimensions
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.dimensions && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.dimensions}</p>
            )}
          </div>

          {/* Property Facing */}
          <div>
            <RadioGroupWithOther
              label="Property Facing"
              name="facing"
              options={['East', 'West', 'North', 'South', 'Other']}
              value={details.facing || ''}
              onChange={(val) => update('facing', val)}
              required
              error={errors.facing}
              otherPlaceholder="Specify custom facing (e.g. North-East)"
            />
          </div>

          {/* Corner Plot */}
          <div>
            <RadioGroupWithOther
              label="Corner Plot?"
              name="cornerPlot"
              options={['Yes', 'No', 'Other']}
              value={details.cornerPlot || ''}
              onChange={(val) => update('cornerPlot', val)}
              required
              error={errors.cornerPlot}
              otherPlaceholder="Specify plot positioning"
            />
          </div>

          {/* Possession Status */}
          <div className="md:col-span-2">
            <PossessionStatusSelector
              propertyType="Residential"
              value={details.possessionStatus || details.possession || ""}
              onChange={(val) => {
                update("possessionStatus", val);
                update("possession", val);
              }}
              error={errors.possessionStatus || errors.possession}
              required={false}
            />
          </div>
        </div>
      </div>

      {/* Group 2: Layout Approvals & Compliance */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Approvals & Infrastructure</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Government development approvals, zoning authority, and boundary protections
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Approved Layout */}
            <div>
              <RadioGroupWithOther
                label="Approved Layout"
                name="approvedLayout"
                options={['Yes', 'No']}
                value={details.approvedLayout || ''}
                onChange={(val) => update('approvedLayout', val)}
                required
                error={errors.approvedLayout}
              />
            </div>

            {/* Boundary wall/fencing */}
            <div>
              <RadioGroupWithOther
                label="Boundary Wall / Fencing Available?"
                name="boundaryWall"
                options={['Yes', 'No']}
                value={details.boundaryWall || ''}
                onChange={(val) => update('boundaryWall', val)}
                error={errors.boundaryWall}
              />
            </div>
          </div>

          {/* Approval Authority */}
          <div>
            <RadioGroupWithOther
              label="Approval Authority"
              name="approvalAuthority"
              options={['BDA', 'BBMP', 'BMRDA', 'Panchayat', 'RERA', 'Other']}
              value={details.approvalAuthority || ''}
              onChange={(val) => update('approvalAuthority', val)}
              required
              error={errors.approvalAuthority}
              otherPlaceholder="Specify approval authority (e.g. DTCP / DC Converted)"
            />
          </div>
        </div>
      </div>

      {/* Group 3: Pricing & Commercials */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Pricing & Commercial Terms</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Expected pricing structure, rate per square foot, and negotiation terms
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          {/* Expected Price */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Expected Price or Price per sq. ft. <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.expectedPrice || ''}
              onChange={(e) => update('expectedPrice', e.target.value)}
              placeholder="e.g. ₹5,500 / sq.ft. or ₹65 Lakhs"
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

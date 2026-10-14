import React from 'react';
import RadioGroupWithOther from './RadioGroupWithOther';
import CheckboxGroupWithOther from './CheckboxGroupWithOther';
import PossessionStatusSelector from './PossessionStatusSelector';

const UTILITIES_OPTIONS = [
  'Water connection',
  'Borewell',
  'Electricity',
  'Drainage',
  'Gas',
  'Other',
];

export default function PlotFields({
  details = {},
  onChange,
  errors = {},
}) {
  const update = (key, val) => onChange(key, val);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Group 1: Layout Identity & Dimensions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Plot Layout & Dimensions</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Gated layout name, plot measurements, facing, and road frontage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Name */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Project / Layout Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={details.projectName || ''}
              onChange={(e) => update('projectName', e.target.value)}
              placeholder="e.g. Prestige Park Square Layout / Green Acres"
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

          {/* Type of Plot/Land */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Type of Plot / Land"
              name="plotType"
              options={['Residential plot', 'Commercial plot', 'Converted land', 'Layout/development land', 'Other']}
              value={details.plotType || ''}
              onChange={(val) => update('plotType', val)}
              required
              error={errors.plotType}
              otherPlaceholder="Specify plot / land type"
            />
          </div>

          {/* Total Land Area */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Total Land Area <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-normal">sq. ft., sq. yd. or acres</span>
            </div>
            <input
              type="text"
              value={details.totalLandArea || ''}
              onChange={(e) => update('totalLandArea', e.target.value)}
              placeholder="e.g. 2,400 sq.ft. or 1.5 Acres"
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

          {/* Plot Dimensions */}
          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Plot Dimensions <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-normal">e.g. 30 x 40 ft.</span>
            </div>
            <input
              type="text"
              value={details.plotDimensions || ''}
              onChange={(e) => update('plotDimensions', e.target.value)}
              placeholder="e.g. 30 x 40 ft or 40 x 60 ft"
              className={`w-full px-3.5 py-2.5 rounded-lg border text-xs bg-white outline-none transition-all ${
                errors.plotDimensions
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/15 hover:border-slate-300'
              }`}
            />
            {errors.plotDimensions && (
              <p className="text-[11px] font-medium text-red-500 mt-1">{errors.plotDimensions}</p>
            )}
          </div>

          {/* Plot Facing */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Plot Facing"
              name="plotFacing"
              options={['North', 'South', 'West', 'East', 'Other']}
              value={details.plotFacing || ''}
              onChange={(val) => update('plotFacing', val)}
              required
              error={errors.plotFacing}
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
              otherPlaceholder="Specify corner orientation"
            />
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

          {/* Number of Roads Adjoining */}
          <div className="md:col-span-2">
            <RadioGroupWithOther
              label="Number of Roads Adjoining Property"
              name="adjoiningRoads"
              options={['0', '1', '2', '3', '4']}
              value={details.adjoiningRoads || ''}
              onChange={(val) => update('adjoiningRoads', val)}
              required
              error={errors.adjoiningRoads}
            />
          </div>
        </div>
      </div>

      {/* Group 2: Legal Approvals & Conversion */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Legal Approvals & Zoning</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Regulatory authority approvals, revenue land conversion status, and boundary fencing
          </p>
        </div>

        <div className="space-y-4">
          {/* Approval Authority */}
          <div>
            <RadioGroupWithOther
              label="Land Approval / Authority"
              name="approvalAuthority"
              options={[
                'BDA',
                'BBMP',
                'BMRDA',
                'RERA',
                'DTCP',
                'Panchayat',
                'KIADB',
                'Approved private layout',
                'Not approved',
                'Other',
              ]}
              value={details.approvalAuthority || ''}
              onChange={(val) => update('approvalAuthority', val)}
              required
              error={errors.approvalAuthority}
              otherPlaceholder="Specify approval authority"
            />
          </div>

          {/* Conversion Status */}
          <div className="pt-1">
            <RadioGroupWithOther
              label="Land Conversion Status"
              name="conversionStatus"
              options={['Converted', 'Not converted', 'Conversion in progress', 'Not applicable']}
              value={details.conversionStatus || ''}
              onChange={(val) => update('conversionStatus', val)}
              required
              error={errors.conversionStatus}
            />
          </div>

          {/* Possession Status */}
          <div className="pt-1">
            <PossessionStatusSelector
              propertyType="Plot/Land"
              value={details.possessionStatus || details.possession || ""}
              onChange={(val) => {
                update("possessionStatus", val);
                update("possession", val);
              }}
              error={errors.possessionStatus || errors.possession}
              required={false}
            />
          </div>

          {/* Boundary/Fencing */}
          <div className="pt-1">
            <RadioGroupWithOther
              label="Boundary Wall / Fencing Available?"
              name="boundaryFencing"
              options={['Yes', 'No']}
              value={details.boundaryFencing || ''}
              onChange={(val) => update('boundaryFencing', val)}
              required
              error={errors.boundaryFencing}
            />
          </div>
        </div>
      </div>

      {/* Group 3: Utilities & Commercials */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800">Utilities & Valuation Terms</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Site water, electricity & drainage lines, target price per sq.ft. or acre, and negotiation
          </p>
        </div>

        <div className="space-y-4">
          {/* Utilities */}
          <div>
            <CheckboxGroupWithOther
              label="Site Utilities Available"
              options={UTILITIES_OPTIONS}
              values={details.utilities || []}
              onChange={(val) => update('utilities', val)}
              required
              error={errors.utilities}
              otherPlaceholder="Specify other utilities available..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1 items-start">
            {/* Expected Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Expected Price per Sq. Ft. / Acre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={details.expectedPrice || ''}
                onChange={(e) => update('expectedPrice', e.target.value)}
                placeholder="e.g. ₹4,500 / sq.ft. or ₹1.2 Cr / Acre"
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

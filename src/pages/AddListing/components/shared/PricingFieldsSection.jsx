import React from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { formatINR } from '@/utils';
import { PRICE_SUFFIXES_BY_CATEGORY } from '@/config/listingConfig';

const PRICE_UNITS = [
  { value: 'exact', label: '₹ (Exact Amount)' },
  { value: 'lakh', label: 'Lakhs (L)' },
  { value: 'crore', label: 'Crores (Cr)' },
];

const PRICE_TYPES = [
  { value: 'fixed', label: 'Fixed Price' },
  { value: 'negotiable', label: 'Negotiable' },
  { value: 'per-month', label: 'Per Month (Rent / Lease)' },
  { value: 'per-year', label: 'Per Year' },
  { value: 'on-request', label: 'Price on Request' },
];

/**
 * Reusable standardized Pricing section with dual Indian Rupee lakh/crore conversion.
 */
export function PricingFieldsSection({
  form = {},
  updateForm,
  category = 'properties',
  errors = {},
}) {
  const numericPrice = parseFloat(form.price) || 0;
  const isLakh = form.priceUnit === 'lakh';
  const isCrore = form.priceUnit === 'crore';
  const absoluteInr = isCrore ? numericPrice * 10000000 : isLakh ? numericPrice * 100000 : numericPrice;

  const suffixOptions = PRICE_SUFFIXES_BY_CATEGORY[category] || ['', 'Onwards'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <i className="fa-solid fa-tag text-emerald-600" />
            <span>Pricing &amp; Commercial Terms</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Dual Indian format (₹ Lakh / Crore or exact)</p>
        </div>

        {numericPrice > 0 && (
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-bold text-emerald-700">Display Value:</span>
            <span className="text-xs sm:text-sm font-extrabold text-emerald-900">
              {formatINR(absoluteInr)}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <Input
            label="Asking Price"
            required
            placeholder="e.g. 8500000 or 85"
            value={form.price || ''}
            onChange={(e) => updateForm('price', e.target.value)}
            error={errors.price}
          />
        </div>

        <div>
          <Select
            label="Price Unit"
            value={form.priceUnit || 'exact'}
            onChange={(e) => updateForm('priceUnit', e.target.value)}
            options={PRICE_UNITS}
          />
        </div>

        <div>
          <Select
            label="Price Suffix / Qualifier"
            value={form.priceSuffix || ''}
            onChange={(e) => updateForm('priceSuffix', e.target.value)}
            options={suffixOptions.map((s) => ({ value: s, label: s || 'None (Flat Price)' }))}
          />
        </div>

        <div>
          <Select
            label="Pricing Model"
            value={form.priceType || 'fixed'}
            onChange={(e) => updateForm('priceType', e.target.value)}
            options={PRICE_TYPES}
          />
        </div>

        <div>
          <Select
            label="Price Negotiable?"
            value={form.negotiable || 'No'}
            onChange={(e) => updateForm('negotiable', e.target.value)}
            options={[
              { value: 'No', label: 'Fixed / Non-Negotiable' },
              { value: 'Yes', label: 'Open for Negotiation' },
            ]}
          />
        </div>

        <div>
          <Input
            label="Discount / Special Offer"
            placeholder="e.g. Festival Benefit of ₹ 35,000"
            value={form.discount || ''}
            onChange={(e) => updateForm('discount', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default PricingFieldsSection;

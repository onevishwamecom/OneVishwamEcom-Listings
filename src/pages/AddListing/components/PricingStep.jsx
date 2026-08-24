import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { PRICE_TYPES, PRICE_UNITS, PRICE_SUFFIXES_BY_CATEGORY } from "../constants";
import { FormSection, FormFieldGroup } from "@/components/ui/PageContainer";

export function PricingStep({ form, updateForm, validationErrors, formatINR, category }) {
  const unitMultiplier = PRICE_UNITS.find((u) => u.value === form.priceUnit)?.multiplier || 1;
  const numericPrice = Number(String(form.price).replace(/[^\d.]/g, '')) * unitMultiplier;
  const suffixOptions = PRICE_SUFFIXES_BY_CATEGORY[category] || ["", "/ month", "/ year", "Onwards"];

  const unitLabel = PRICE_UNITS.find((u) => u.value === form.priceUnit)?.label || '₹';

  // Format the preview price in compact Indian notation
  function formatPreview(num) {
    if (!num || isNaN(num)) return '';
    if (num >= 10000000) {
      const cr = num / 10000000;
      return `₹${cr % 1 === 0 ? cr : cr.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} Cr`;
    }
    if (num >= 100000) {
      const l = num / 100000;
      return `₹${l % 1 === 0 ? l : l.toFixed(2).replace(/0+$/, '').replace(/\.$/, '')} L`;
    }
    if (num >= 1000) {
      return `₹${num.toLocaleString('en-IN')}`;
    }
    return `₹${num}`;
  }

  return (
    <FormSection title="Pricing" description="Set the price for your listing using Indian currency system">
      {/* Price + Unit Row */}
      <FormFieldGroup>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Price <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-400 font-bold">₹</span>
            </div>
            <Input
              id="price"
              label=""
              type="text"
              value={form.price}
              onChange={(e) => updateForm("price", e.target.value.replace(/[^\d.]/g, ''))}
              placeholder="0"
              required
              error={validationErrors.price}
              inputClassName="pl-10 font-medium text-lg"
            />
          </div>
          <div className="w-44">
            <Select
              id="priceUnit"
              label=""
              value={form.priceUnit || "exact"}
              onChange={(e) => updateForm("priceUnit", e.target.value)}
              options={PRICE_UNITS.map((u) => ({ value: u.value, label: u.label }))}
            />
          </div>
        </div>
      </FormFieldGroup>

      {/* Price Type + Suffix Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormFieldGroup>
          <Select
            id="priceType"
            label="Price Type"
            value={form.priceType}
            onChange={(e) => updateForm("priceType", e.target.value)}
            options={PRICE_TYPES}
            placeholder="Select Price Type"
            required
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <Select
            id="priceSuffix"
            label="Price Suffix (Optional)"
            value={form.priceSuffix}
            onChange={(e) => updateForm("priceSuffix", e.target.value)}
            options={suffixOptions.map((s) => s || "(None)")}
            placeholder="Select suffix"
          />
        </FormFieldGroup>
      </div>

      {/* Live Preview */}
      {form.price && (
        <div className="p-4 bg-gradient-to-r from-brand-gold/10 to-brand-blue/5 border border-brand-gold/30 rounded-xl mt-2">
          <p className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <i className="fa-solid fa-tag text-brand-gold" />
            <span>Display Preview:</span>
          </p>
          <p className="mt-1.5 text-xl font-extrabold text-brand-blue">
            {formatPreview(numericPrice)}
            {form.priceSuffix && form.priceSuffix !== "(None)" && (
              <span className="text-base font-medium text-slate-500 ml-2">{form.priceSuffix}</span>
            )}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {form.priceType === "negotiable" && <Badge variant="warning" className="text-[10px]">Negotiable</Badge>}
            {form.priceType === "on-request" && <Badge variant="blue" className="text-[10px]">Price on Request</Badge>}
            {form.priceType === "per-month" && <Badge variant="blue" className="text-[10px]">Monthly Rent</Badge>}
            {form.priceType === "per-year" && <Badge variant="blue" className="text-[10px]">Yearly</Badge>}
          </div>
          <p className="mt-1.5 text-[10px] text-slate-400">
            Raw value: {formatINR(numericPrice)} ({unitLabel})
          </p>
        </div>
      )}
    </FormSection>
  );
}
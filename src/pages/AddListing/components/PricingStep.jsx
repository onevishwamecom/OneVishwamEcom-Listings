import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import { PRICE_TYPES } from "../constants";
import { FormSection, FormFieldGroup } from "@/components/ui/PageContainer";

export function PricingStep({ form, updateForm, validationErrors, formatINR }) {

  return (
    <FormSection title="Pricing" description="Set the price for your listing">
      <FormFieldGroup>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Price <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-slate-400 font-bold">₹</span>
          </div>
          <Input
            id="price"
            label=""
            type="text"
            value={form.price}
            onChange={(e) => updateForm("price", e.target.value.replace(/\D/g, ''))}
            placeholder="0"
            required
            error={validationErrors.price}
            inputClassName="pl-10 font-medium text-lg"
          />
        </div>
      </FormFieldGroup>

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

      {form.priceType === "fixed" && (
        <FormFieldGroup>
          <Select
            id="priceSuffix"
            label="Price Suffix (Optional)"
            value={form.priceSuffix}
            onChange={(e) => updateForm("priceSuffix", e.target.value)}
            options={["", "/ Per Month", "/ Per Year", "Negotiable", "/ Sq. Ft."]}
            placeholder="Select suffix"
          />
        </FormFieldGroup>
      )}

      {form.price && (
        <div className="p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl mt-2">
          <p className="text-sm font-medium text-brand-gold flex items-center gap-2">
            <i className="fa-solid fa-tag" />
            Display Price: <span className="font-extrabold text-base">{formatINR(form.price)}</span>
            {form.priceSuffix && <span className="text-brand-gold/80">{form.priceSuffix}</span>}
            {form.priceType === "negotiable" && <Badge variant="warning" className="ml-2 text-[10px]">Negotiable</Badge>}
            {form.priceType === "on-request" && <Badge variant="blue" className="ml-2 text-[10px]">Price on Request</Badge>}
          </p>
        </div>
      )}
    </FormSection>
  );
}
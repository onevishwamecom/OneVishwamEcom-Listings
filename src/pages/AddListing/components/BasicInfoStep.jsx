import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { SUBCATEGORIES } from "../constants";
import { FormSection, FormFieldGroup } from "@/components/ui/PageContainer";

export function BasicInfoStep({ form, updateForm, validationErrors }) {
  return (
    <FormSection title="Basic Information" description="Provide the main information for your listing">
      <FormFieldGroup>
        <Input
          id="title"
          label="Product / Listing Name"
          value={form.title}
          onChange={(e) => updateForm("title", e.target.value)}
          placeholder="e.g. 3 BHK Luxury Apartment in Whitefield"
          required
          error={validationErrors.title}
        />

        <Input
          id="subtitle"
          label="Short Description"
          value={form.subtitle}
          onChange={(e) => updateForm("subtitle", e.target.value)}
          placeholder="e.g. Ready to move, fully furnished, near metro"
        />
      </FormFieldGroup>

      {form.category && (
        <FormFieldGroup>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Subcategory <span className="text-red-500">*</span>
          </label>
          <Select
            id="subcategory"
            label=""
            value={form.subcategory}
            onChange={(e) => updateForm("subcategory", e.target.value)}
            options={SUBCATEGORIES[form.category] || []}
            placeholder="Select Subcategory"
            required
            error={validationErrors.subcategory}
          />
        </FormFieldGroup>
      )}

      <FormFieldGroup>
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Detailed Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => updateForm("description", e.target.value)}
          placeholder="Describe your item in detail. Highlight key features, condition, and benefits..."
          className={`w-full rounded-2xl border bg-slate-50/50 px-4 py-3 text-sm outline-none resize-none transition-all duration-200 ${
            validationErrors.description
              ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white"
              : "border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
          }`}
          required
        />
        {validationErrors.description && (
          <p className="mt-1 text-xs font-semibold text-red-500 animate-fade-in">{validationErrors.description}</p>
        )}
      </FormFieldGroup>
    </FormSection>
  );
}
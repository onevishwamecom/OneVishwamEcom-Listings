import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { CATEGORIES } from "../constants";
import { FormSection, FormFieldGroup } from "@/components/ui/PageContainer";

export function DetailsStep({ form, updateForm, category, catFields, validationErrors }) {
  if (!category || !catFields.length) {
    return (
      <FormSection compact>
        <div className="bg-slate-50 rounded-xl border border-slate-100 p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-3">
            <i className="fa-solid fa-check text-xl text-brand-gold" />
          </div>
          <p className="text-slate-600 font-medium">No additional details needed for this category.</p>
          <p className="text-sm text-slate-400 mt-0.5">You can proceed to the next step.</p>
        </div>
      </FormSection>
    );
  }

  return (
    <FormSection title={`${CATEGORIES.find((c) => c.id === category)?.label} Details`} description="Add specific information for this category">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        {catFields.map((field) => (
          <FormFieldGroup key={field.name}>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "select" ? (
              <Select
                id={field.name}
                label=""
                value={form[field.name] || ""}
                onChange={(e) => updateForm(field.name, e.target.value)}
                options={field.options}
                placeholder={`Select ${field.label}`}
                required={field.required}
                error={validationErrors[field.name]}
                selectClassName="appearance-none"
              />
            ) : (
              <Input
                id={field.name}
                label=""
                type={field.type}
                value={form[field.name] || ""}
                onChange={(e) => updateForm(field.name, e.target.value)}
                placeholder={field.placeholder || ""}
                required={field.required}
                error={validationErrors[field.name]}
                inputClassName={field.type === "number" ? "font-medium" : ""}
              />
            )}
          </FormFieldGroup>
        ))}
      </div>
    </FormSection>
  );
}
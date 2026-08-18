import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { CATEGORIES } from "../constants";

export function DetailsStep({ form, updateForm, category, catFields, validationErrors }) {
  if (!category || !catFields.length) {
    return (
      <div className="animate-fade-in">
        <div className="bg-slate-50 rounded-2xl border border-slate-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-check text-2xl text-brand-gold" />
          </div>
          <p className="text-slate-600 font-medium">No additional details needed for this category.</p>
          <p className="text-sm text-slate-400 mt-1">You can proceed to the next step.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${CATEGORIES.find((c) => c.id === category)?.gradient} flex items-center justify-center text-white shadow-sm`}>
          <i className={`fa-solid ${CATEGORIES.find((c) => c.id === category)?.icon}`} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">{CATEGORIES.find((c) => c.id === category)?.label} Details</h2>
          <p className="text-sm text-slate-500 mt-0.5">Add specific information for this category</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
        {catFields.map((field) => (
          <div key={field.name}>
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
          </div>
        ))}
      </div>
    </div>
  );
}
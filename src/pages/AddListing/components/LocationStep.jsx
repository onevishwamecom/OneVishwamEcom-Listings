import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { STATES, DISTRICTS, CITY_DATA } from "../constants";
import { FormSection, FormFieldGroup } from "@/components/ui/PageContainer";

export function LocationStep({ form, updateForm, validationErrors }) {
  const districts = DISTRICTS[form.state] || [];

  return (
    <FormSection title="Location" description="Where is your item located?">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormFieldGroup>
          <Select
            id="state"
            label="State"
            value={form.state}
            onChange={(e) => {
              updateForm("state", e.target.value);
              updateForm("district", "");
            }}
            options={STATES}
            placeholder="Select State"
            required
            error={validationErrors.state}
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <Select
            id="district"
            label="District"
            value={form.district}
            onChange={(e) => updateForm("district", e.target.value)}
            options={districts}
            placeholder="Select District"
            required
            disabled={!form.state}
            error={validationErrors.district}
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <Select
            id="city"
            label="City"
            value={form.city}
            onChange={(e) => updateForm("city", e.target.value)}
            options={Object.entries(CITY_DATA).map(([id, city]) => ({ value: id, label: city.label }))}
            placeholder="Select City"
            required
            error={validationErrors.city}
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <Input
            id="area"
            label="Area / Locality"
            value={form.area}
            onChange={(e) => updateForm("area", e.target.value)}
            placeholder="e.g. Whitefield, Koramangala"
            required
            error={validationErrors.area}
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <Input
            id="pincode"
            label="PIN Code"
            type="text"
            value={form.pincode}
            onChange={(e) => updateForm("pincode", e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="e.g. 560066"
            required
            error={validationErrors.pincode}
            inputClassName="font-mono"
          />
        </FormFieldGroup>

        <FormFieldGroup>
          <Input
            id="contact"
            label="Contact Phone"
            type="tel"
            value={form.contact}
            onChange={(e) => updateForm("contact", e.target.value)}
            placeholder="e.g. 9876543210"
            error={validationErrors.contact}
          />
        </FormFieldGroup>

        <FormFieldGroup className="md:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Full Address <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={2}
            id="address"
            value={form.address}
            onChange={(e) => updateForm("address", e.target.value)}
            placeholder="e.g. Building / Door No, Street Name, Plot Details, Whitefield"
            className={`w-full rounded-2xl border bg-slate-50/50 px-4 py-3 text-sm outline-none resize-none transition-all duration-200 ${
              validationErrors.address
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 focus:bg-white"
                : "border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
            }`}
            required
          />
          {validationErrors.address && (
            <p className="mt-1 text-xs font-semibold text-red-500 animate-fade-in">{validationErrors.address}</p>
          )}
        </FormFieldGroup>

        <FormFieldGroup className="md:col-span-2">
          <Input
            id="landmark"
            label="Landmark / Nearby (Optional)"
            type="text"
            value={form.landmark}
            onChange={(e) => updateForm("landmark", e.target.value)}
            placeholder="e.g. Near Metro Station, Opp. City Mall"
            error={validationErrors.landmark}
          />
        </FormFieldGroup>
      </div>

      {(form.address || form.area || form.city) && (
        <div className="mt-3 p-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
          <p className="text-sm font-medium text-brand-blue flex items-center gap-2">
            <i className="fa-solid fa-location-dot" />
            {[form.address, form.area, CITY_DATA[form.city]?.label || form.city, form.pincode].filter(Boolean).join(", ")}
          </p>
        </div>
      )}
    </FormSection>
  );
}
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
          <Input
            id="landmark"
            label="Full Address / Landmark"
            type="text"
            value={form.landmark}
            onChange={(e) => updateForm("landmark", e.target.value)}
            placeholder="e.g. Near Metro Station, Opp. City Mall"
            error={validationErrors.landmark}
          />
        </FormFieldGroup>
      </div>

      {form.area && form.city && (
        <div className="mt-3 p-3 bg-brand-blue/5 border border-brand-blue/20 rounded-xl">
          <p className="text-sm font-medium text-brand-blue flex items-center gap-2">
            <i className="fa-solid fa-location-dot" />
            {form.area}, {CITY_DATA[form.city]?.label || form.city}, {form.pincode}
          </p>
        </div>
      )}
    </FormSection>
  );
}
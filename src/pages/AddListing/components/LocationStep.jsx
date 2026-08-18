import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { STATES, DISTRICTS, CITY_DATA } from "../constants";

export function LocationStep({ form, updateForm, validationErrors }) {
  const districts = DISTRICTS[form.state] || [];

  return (
    <div className="animate-fade-in space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Location</h2>
        <p className="text-sm text-slate-500 mt-1">Where is your item located?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <Input
          id="area"
          label="Area / Locality"
          value={form.area}
          onChange={(e) => updateForm("area", e.target.value)}
          placeholder="e.g. Whitefield, Koramangala"
          required
          error={validationErrors.area}
        />

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
      </div>

      {form.area && form.city && (
        <div className="p-4 bg-brand-blue/5 border border-brand-blue/20 rounded-2xl">
          <p className="text-sm font-medium text-brand-blue flex items-center gap-2">
            <i className="fa-solid fa-location-dot" />
            {form.area}, {CITY_DATA[form.city]?.label || form.city}, {form.pincode}
          </p>
        </div>
      )}
    </div>
  );
}
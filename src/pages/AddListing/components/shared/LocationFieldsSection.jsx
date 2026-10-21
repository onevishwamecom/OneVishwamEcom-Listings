import React from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { cities } from '@/data/locations';

const CITY_OPTIONS = (cities || ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi']).map((c) => {
  const name = typeof c === 'object' ? c.name : c;
  return { value: name, label: name };
});

/**
 * Reusable standardized Location section for all categories.
 */
export function LocationFieldsSection({
  form = {},
  updateForm,
  errors = {},
  title = 'Location & Address Details',
  subtitle = 'Where buyers and clients can inspect, collect, or visit',
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <i className="fa-solid fa-location-dot text-rose-500" />
          <span>{title}</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <Input
            label="Locality / Area / Landmark"
            required
            placeholder="e.g. Indiranagar, Whitefield, Koramangala, Outer Ring Road"
            value={form.area || ''}
            onChange={(e) => updateForm('area', e.target.value)}
            error={errors.area}
          />
        </div>

        <div>
          <Select
            label="City"
            value={form.city || 'Bengaluru'}
            onChange={(e) => updateForm('city', e.target.value)}
            options={CITY_OPTIONS}
          />
        </div>

        <div className="sm:col-span-2">
          <Input
            label="Full Street Address"
            placeholder="e.g. #42, 100 Feet Road, HAL 2nd Stage, Indiranagar"
            value={form.address || ''}
            onChange={(e) => updateForm('address', e.target.value)}
            error={errors.address}
          />
        </div>

        <div>
          <Input
            label="Pincode"
            placeholder="e.g. 560038"
            value={form.pincode || ''}
            onChange={(e) => updateForm('pincode', e.target.value)}
            error={errors.pincode}
          />
        </div>

        <div className="sm:col-span-3">
          <Input
            label="Google Maps Location Link"
            placeholder="https://maps.app.goo.gl/... or https://goo.gl/maps/..."
            value={form.locationUrl || ''}
            onChange={(e) => updateForm('locationUrl', e.target.value)}
          />
          <p className="text-[11px] text-slate-400 mt-1">
            Enables instant Google Maps navigation directions for verified buyers on OneVishwam.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LocationFieldsSection;

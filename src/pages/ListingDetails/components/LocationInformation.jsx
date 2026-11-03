import { SectionCard, InfoRow } from './UIComponents';

export function LocationInformation({ location }) {
  return (
    <SectionCard title="Location" icon="fa-location-dot">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow label="State" value={location.state} />
        <InfoRow label="District" value={location.district} />
        <InfoRow label="City" value={location.city.charAt(0).toUpperCase() + location.city.slice(1)} />
        <InfoRow label="Area / Locality" value={location.area} />
        <InfoRow label="PIN Code" value={location.pincode} />
        {location.mapUrl && (
          <div className="sm:col-span-2 pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-medium">Google Maps Location</span>
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline"
            >
              <i className="fa-solid fa-map-location-dot" />
              <span>Open on Google Maps</span>
              <i className="fa-solid fa-arrow-up-right-from-square text-[10px]" />
            </a>
          </div>
        )}
      </dl>
    </SectionCard>
  );
}
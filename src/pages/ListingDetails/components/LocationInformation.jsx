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
      </dl>
    </SectionCard>
  );
}
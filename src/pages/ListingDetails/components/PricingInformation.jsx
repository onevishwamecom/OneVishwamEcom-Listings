import { SectionCard, InfoRow } from './UIComponents';

export function PricingInformation({ listing, price, priceTypeLabel }) {
  return (
    <SectionCard title="Pricing" icon="fa-tag">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow label="Price" value={price || 'Not set'} />
        <InfoRow label="Price Type" value={priceTypeLabel} />
        {listing.priceSuffix && <InfoRow label="Price Suffix" value={listing.priceSuffix} />}
        {listing.contact && <InfoRow label="Contact" value={listing.contact} />}
      </dl>
    </SectionCard>
  );
}
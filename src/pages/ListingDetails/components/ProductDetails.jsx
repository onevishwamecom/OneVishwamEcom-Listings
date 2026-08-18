import { SectionCard, InfoRow } from './UIComponents';

export function ProductDetails({ categoryFields }) {
  if (!categoryFields.length) return null;

  return (
    <SectionCard title="Product Details" icon="fa-list-check">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categoryFields.map((field, index) => (
          <InfoRow key={index} label={field.label} value={field.value} />
        ))}
      </dl>
    </SectionCard>
  );
}
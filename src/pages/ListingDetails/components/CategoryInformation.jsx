import { SectionCard, InfoRow } from './UIComponents';

export function CategoryInformation({ categoryInfo, subcategory }) {
  return (
    <SectionCard title="Category" icon="fa-table-cells-large">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow label="Category" value={categoryInfo.label} />
        <InfoRow label="Subcategory" value={subcategory} />
      </dl>
    </SectionCard>
  );
}
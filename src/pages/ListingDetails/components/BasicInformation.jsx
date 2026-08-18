import { SectionCard, InfoRow } from './UIComponents';

export function BasicInformation({ listing, displayTitle }) {
  return (
    <SectionCard title="Basic Information" icon="fa-file-lines">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoRow label="Product / Listing Name" value={displayTitle} />
        <InfoRow label="Short Description" value={listing.subtitle} />
      </dl>
      {listing.description && (
        <div className="mt-4 pt-4 border-t border-slate-100">
          <dt className="text-slate-500 font-medium text-sm mb-2">Detailed Description</dt>
          <dd className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-wrap">
            {listing.description}
          </dd>
        </div>
      )}
    </SectionCard>
  );
}
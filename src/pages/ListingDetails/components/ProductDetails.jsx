import React from 'react';
import { SectionCard, InfoRow } from './UIComponents';

export function ProductDetails({ categoryFields = [] }) {
  if (!categoryFields.length) return null;

  return (
    <SectionCard title="Specifications & Key Attributes" icon="fa-list-check">
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categoryFields.map((field, index) => {
          const isTagList =
            (field.label.toLowerCase().includes('variants') ||
              field.label.toLowerCase().includes('features') ||
              field.label.toLowerCase().includes('amenities') ||
              field.label.toLowerCase().includes('equipment')) &&
            typeof field.value === 'string' &&
            field.value.includes(',');

          if (isTagList) {
            const tags = field.value
              .split(',')
              .map((t) => t.trim())
              .filter(Boolean);

            return (
              <div key={index} className="sm:col-span-2 pt-2 pb-1 border-t border-slate-100 first:border-0 first:pt-0">
                <dt className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <i className="fa-solid fa-tags text-[10px] text-brand-blue" />
                  <span>{field.label}</span>
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {tags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200/80"
                    >
                      {tag}
                    </span>
                  ))}
                </dd>
              </div>
            );
          }

          return <InfoRow key={index} label={field.label} value={field.value} />;
        })}
      </dl>
    </SectionCard>
  );
}

export default ProductDetails;
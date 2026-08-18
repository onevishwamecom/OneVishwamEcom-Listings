export function SectionCard({ title, icon, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-100 bg-white p-6 shadow-card ${className}`}>
      <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
        {icon && <i className={`fa-solid ${icon} text-slate-400`} />}
        {title}
      </h3>
      {children}
    </div>
  );
}

export function InfoRow({ label, value, className = '' }) {
  if (!value || value === '—') return null;
  return (
    <div className={`grid grid-cols-[auto_1fr] gap-4 py-3 ${className}`}>
      <dt className="text-slate-500 font-medium text-sm">{label}</dt>
      <dd className="font-semibold text-slate-900 text-sm break-words">{value}</dd>
    </div>
  );
}
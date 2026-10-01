export function SectionCard({ title, icon, children, className = '' }) {
  return (
    <div className={`rounded-2xl border border-slate-200/70 bg-white p-4 sm:p-5 shadow-xs ${className}`}>
      {title && (
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 mb-3.5 pb-2.5 border-b border-slate-100">
          {icon && <i className={`fa-solid ${icon} text-slate-400 text-sm`} aria-hidden="true" />}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

export function InfoRow({ label, value, className = '' }) {
  if (!value || value === '—') return null;
  return (
    <div className={`flex flex-col sm:flex-row sm:items-baseline justify-between py-2 border-b border-slate-50 last:border-0 ${className}`}>
      <dt className="text-slate-500 font-medium text-xs mb-0.5 sm:mb-0">{label}</dt>
      <dd className="font-semibold text-slate-900 text-xs sm:text-right break-words">{value}</dd>
    </div>
  );
}
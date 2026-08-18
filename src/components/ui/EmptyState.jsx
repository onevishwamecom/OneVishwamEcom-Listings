export function EmptyState({ icon = 'fa-inbox', title, subtitle, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-16 bg-white rounded-3xl border border-slate-100 shadow-sm text-center px-4 animate-fade-in ${className}`}
    >
      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center mb-5 border border-brand-blue/10">
        <i className={`fa-solid ${icon} text-3xl text-brand-blue/60`} aria-hidden="true" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      {subtitle && (
        <p className="text-sm font-medium text-slate-500 max-w-sm mb-6">{subtitle}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export default EmptyState;
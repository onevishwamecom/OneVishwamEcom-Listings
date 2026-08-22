export function PageHeader({ title, subtitle, action, leading, className = '' }) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 ${className}`.trim()}>
      <div className="flex items-center gap-3 min-w-0">
        {leading}
        <div className="min-w-0">
          {title && (
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          )}
          {subtitle && <p className="text-slate-500 font-medium mt-1">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export default PageHeader;
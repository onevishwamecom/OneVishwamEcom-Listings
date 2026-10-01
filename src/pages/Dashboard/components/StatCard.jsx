import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

export function StatCard({ label, value, icon, gradient, delay = 0, action }) {
  const isNumber = typeof value === 'number';
  const animatedValue = useAnimatedCounter(isNumber ? value : 0);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-500 tracking-wide">{label}</p>
        <div className={`h-8 w-8 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-xs shrink-0`}>
          <i className={`fa-solid ${icon} text-xs`} aria-hidden="true" />
        </div>
      </div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          {isNumber ? animatedValue : value}
        </span>
        {action}
      </div>
    </div>
  );
}
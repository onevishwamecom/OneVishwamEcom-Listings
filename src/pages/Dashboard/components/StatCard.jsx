import { useAnimatedCounter } from '../hooks/useAnimatedCounter';

export function StatCard({ label, value, icon, gradient, delay = 0, action }) {
  const isNumber = typeof value === 'number';
  const animatedValue = useAnimatedCounter(isNumber ? value : 0);

  return (
    <div
      className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-card hover:shadow-card-hover hover-lift overflow-hidden opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`} />
      <div className="flex items-center gap-3 mb-3">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110`}>
          <i className={`fa-solid ${icon} text-sm`} aria-hidden="true" />
        </div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="text-2xl font-extrabold text-slate-900">
          {isNumber ? animatedValue : value}
        </span>
        {action}
      </div>
    </div>
  );
}
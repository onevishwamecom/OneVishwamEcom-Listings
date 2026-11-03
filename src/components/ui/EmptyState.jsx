import React from 'react';
import LottieFeedbackAnimation from './LottieFeedbackAnimation';

export function EmptyState({
  icon = 'fa-box-open',
  title,
  subtitle,
  action,
  animationType = 'emptyCatalog',
  showAnimation = true,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 bg-white rounded-3xl border border-slate-100 shadow-xs text-center px-4 animate-fade-in ${className}`}
    >
      {showAnimation ? (
        <div className="mb-2">
          <LottieFeedbackAnimation type={animationType} size="md" fallbackIcon={`fa-solid ${icon}`} />
        </div>
      ) : (
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 flex items-center justify-center mb-4 border border-brand-blue/10">
          <i className={`fa-solid ${icon} text-2xl text-brand-blue/60`} aria-hidden="true" />
        </div>
      )}
      <h3 className="text-lg font-bold text-slate-900 mb-1 tracking-tight">{title}</h3>
      {subtitle && (
        <p className="text-sm font-medium text-slate-500 max-w-sm mb-5 leading-relaxed">{subtitle}</p>
      )}
      {action && <div className="mt-1">{action}</div>}
    </div>
  );
}

export default EmptyState;
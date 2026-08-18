import { StatCard } from './StatCard';
import { formatDate } from '@/utils';

export function StatCards({ user, stats, verifyEmailAction }) {
  const statCards = [
    { label: 'Total Listings', value: stats.total, icon: 'fa-layer-group', gradient: 'from-brand-blue to-brand-blue/70' },
    { label: 'Email Verified', value: user?.isEmailVerified ? 'Yes' : 'No', icon: 'fa-shield-halved', gradient: 'from-brand-gold to-brand-gold/70', action: verifyEmailAction },
    { label: 'Account Status', value: user?.accountStatus || 'active', icon: 'fa-user-check', gradient: 'from-slate-400 to-slate-500' },
    { label: 'Member Since', value: formatDate(user?.createdAt), icon: 'fa-calendar-days', gradient: 'from-brand-orange to-brand-orange/70' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card, i) => (
        <StatCard
          key={card.label}
          label={card.label}
          value={card.value}
          icon={card.icon}
          gradient={card.gradient}
          delay={i * 100}
          action={card.action}
        />
      ))}
    </div>
  );
}
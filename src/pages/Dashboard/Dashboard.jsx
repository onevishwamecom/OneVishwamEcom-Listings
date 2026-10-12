import { Link } from 'react-router-dom';
import { useAuth } from '@/store/authSlice';
import { useListingStats } from '@/components/ListingStats';
import { DashboardSkeleton } from '@/components/skeleton';
import { WelcomeBanner } from './components/WelcomeBanner';
import { StatCards } from './components/StatCards';
import { ListingsByType } from './components/ListingsByType';

export default function Dashboard() {
  const { user } = useAuth();
  const { total: statsTotal, byType: statsByType, loading, error: statsError, refresh: refreshStats } = useListingStats();
  const stats = { total: statsTotal, byType: statsByType };

  const displayName = user?.fullName || 'User';
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'U';

  const verifyEmailAction = !user?.isEmailVerified ? (
    <Link
      to="/profile"
      className="inline-flex items-center gap-1 text-xs font-bold text-brand-blue hover:text-brand-blue/70 transition-colors"
      aria-label="Verify your email"
    >
      Verify Now
      <i className="fa-solid fa-arrow-right text-[10px]" aria-hidden="true" />
    </Link>
  ) : null;

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8">
      <WelcomeBanner user={user} verifyEmailAction={verifyEmailAction} initial={initial} displayName={displayName} />
      <StatCards user={user} stats={stats} verifyEmailAction={verifyEmailAction} />
      <ListingsByType stats={{ total: stats.total, byType: stats.byType }} loading={loading} error={statsError} onRetry={refreshStats} />
    </div>
  );
}
import { Link } from 'react-router-dom';
import { ErrorState } from '@/components/skeleton';
import { ListingTypeCard, ListingTypeSkeleton, EmptyStateCard } from './ListingTypeCard';

export function ListingsByType({ stats, loading, error, onRetry }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Listings by Category</h2>
          <p className="text-sm text-slate-400 mt-0.5">Breakdown of your posted items</p>
        </div>
        {stats.total > 0 && (
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue hover:text-brand-orange transition-colors group"
          >
            View All
            <i className="fa-solid fa-arrow-right text-xs transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </div>

      {error ? (
        <ErrorState
          icon="fa-chart-simple"
          title="Unable to load category stats"
          message="We couldn't load your category breakdown. Please try again."
          onRetry={onRetry}
        />
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" aria-hidden="true">
          {[1, 2, 3].map((i) => (
            <ListingTypeSkeleton key={i} index={i} />
          ))}
        </div>
      ) : stats.total === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.byType).map(([type, count], i) => (
            <ListingTypeCard key={type} type={type} count={count} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
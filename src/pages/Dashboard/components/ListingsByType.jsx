import { Link } from 'react-router-dom';
import { ErrorState } from '@/components/skeleton';
import { ListingTypeCard, ListingTypeSkeleton, EmptyStateCard } from './ListingTypeCard';
import { PRIMARY_CATEGORIES } from '@/config/listingConfig';

export function ListingsByType({ stats, loading, error, onRetry }) {
  const categoryTiles = PRIMARY_CATEGORIES.map((cat) => ({
    type: cat.id,
    count: stats.byType?.[cat.id] || 0,
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">Listings by Category</h2>
          <p className="text-xs text-slate-400 mt-0.5">Overview of items posted per category</p>
        </div>
        {stats.total > 0 && (
          <Link
            to="/listings"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:text-blue-700 transition-colors group"
          >
            View All
            <i className="fa-solid fa-arrow-right text-[10px] transition-transform group-hover:translate-x-1" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ListingTypeSkeleton key={i} />
          ))}
        </div>
      ) : stats.total === 0 ? (
        <EmptyStateCard />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {categoryTiles.map(({ type, count }, i) => (
            <ListingTypeCard key={type} type={type} count={count} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListingsByType;
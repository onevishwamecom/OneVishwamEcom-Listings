import ListingCardSkeleton from './ListingCardSkeleton';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * ListingGridSkeleton — responsive grid of listing card skeletons.
 * Responsive: 1 col on mobile, 2 on sm, 3 on lg, 4 on xl.
 */
export function ListingGridSkeleton({ count = 8, className = '' }) {
  return (
    <SkeletonLoading label="Loading listings…" className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {Array.from({ length: count }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    </SkeletonLoading>
  );
}

export default ListingGridSkeleton;

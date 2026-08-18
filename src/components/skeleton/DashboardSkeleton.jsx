import Skeleton from './Skeleton';
import SkeletonButton from './SkeletonButton';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * DashboardSkeleton — mirrors the contributor dashboard layout:
 * welcome banner, four stat cards, then the "Listings by Category" tiles.
 */
export function DashboardSkeleton() {
  return (
    <SkeletonLoading label="Loading dashboard…" className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-2xl bg-hero-gradient p-6 sm:p-8 overflow-hidden shadow-lg">
        <div className="flex items-center gap-4">
          <Skeleton className="h-16 w-16 sm:h-20 sm:w-20 rounded-3xl bg-white/10" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-48 sm:w-64 bg-white/10" rounded="rounded-lg" />
            <Skeleton className="h-4 w-72 max-w-full bg-white/10" rounded="rounded-md" />
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <SkeletonButton className="h-12 w-40 bg-white/15" />
          <SkeletonButton className="h-12 w-28 bg-white/10" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-xl" />
              <Skeleton className="h-3 w-24" rounded="rounded" />
            </div>
            <Skeleton className="h-7 w-16 mb-1.5" rounded="rounded-lg" />
            <Skeleton className="h-2.5 w-20" rounded="rounded" />
          </div>
        ))}
      </div>

      {/* Category tiles */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" rounded="rounded-lg" />
            <Skeleton className="h-3.5 w-64" rounded="rounded-md" />
          </div>
          <Skeleton className="h-4 w-20" rounded="rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-3.5 w-2/3" rounded="rounded" />
                  <Skeleton className="h-6 w-12" rounded="rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SkeletonLoading>
  );
}

export default DashboardSkeleton;
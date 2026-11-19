import Skeleton from './Skeleton';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * DashboardSkeleton — mirrors the contributor dashboard layout:
 * welcome banner with avatar and action buttons, four stat cards,
 * and the 6 category breakdown tiles.
 */
export function DashboardSkeleton() {
  return (
    <SkeletonLoading label="Loading dashboard…" className="flex flex-col gap-5">
      {/* Welcome banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0a192f] via-[#0f233a] to-[#134e8f] p-5 sm:p-6 text-white overflow-hidden shadow-sm border border-blue-900/40">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white/10 shrink-0" />
            <div className="min-w-0 space-y-2">
              <Skeleton className="h-3 w-28 bg-white/10" rounded="rounded" />
              <Skeleton className="h-6 w-48 sm:w-60 bg-white/10" rounded="rounded-lg" />
              <Skeleton className="h-3 w-40 bg-white/10" rounded="rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10">
            <Skeleton className="h-9 w-28 rounded-xl bg-white/15 shrink-0" />
            <Skeleton className="h-9 w-24 rounded-xl bg-white/10 shrink-0" />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="relative bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <Skeleton className="h-3 w-20" rounded="rounded" />
              <Skeleton className="h-8 w-8 rounded-xl shrink-0" />
            </div>
            <div className="mt-1">
              <Skeleton className="h-7 w-14" rounded="rounded-lg" />
            </div>
          </div>
        ))}
      </div>

      {/* Category tiles */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <Skeleton className="h-5 w-44" rounded="rounded-lg" />
            <Skeleton className="h-3 w-56" rounded="rounded-md" />
          </div>
          <Skeleton className="h-4 w-16" rounded="rounded-md" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200/70 p-4 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="space-y-1.5">
                  <Skeleton className="h-3.5 w-20" rounded="rounded" />
                  <Skeleton className="h-5 w-8" rounded="rounded-md" />
                </div>
              </div>
              <Skeleton className="h-4 w-4 rounded-full shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonLoading>
  );
}

export default DashboardSkeleton;

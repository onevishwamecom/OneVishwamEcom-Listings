import Skeleton from './Skeleton';
import SkeletonTable from './SkeletonTable';
import SkeletonButton from './SkeletonButton';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * ListingsPageSkeleton — mirrors the Listed Items page:
 * header, status tab pills, filter bar, desktop table (lg+) and
 * mobile card rows (<lg) so the skeleton matches the real layout.
 */
export function ListingsPageSkeleton() {
  return (
    <SkeletonLoading label="Loading listings…" className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2.5">
          <Skeleton className="h-8 w-52" rounded="rounded-lg" />
          <Skeleton className="h-4 w-80 max-w-full" rounded="rounded-md" />
        </div>
        <SkeletonButton className="h-12 w-44" />
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 items-center px-1 py-1 bg-slate-200/50 rounded-2xl w-fit">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-24 rounded-xl" />
        ))}
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden">
        {/* Filter bar */}
        <div className="p-5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px] gap-3">
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
          <Skeleton className="h-12 rounded-2xl" />
        </div>

        {/* Desktop skeleton table */}
        <div className="hidden lg:block">
          <SkeletonTable
            rows={6}
            columns={5}
            action
            headers={['Product', 'Category', 'Location', 'Date', 'Status']}
            className="border-0 shadow-none rounded-none"
          />
        </div>

        {/* Mobile skeleton rows */}
        <div className="lg:hidden divide-y divide-slate-100">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4">
              <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2.5 min-w-0">
                <Skeleton className="h-4 w-3/4" rounded="rounded-md" />
                <Skeleton className="h-3 w-1/2" rounded="rounded" />
                <div className="flex items-center gap-2 pt-1">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-3 w-24" rounded="rounded" />
                </div>
              </div>
              <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </SkeletonLoading>
  );
}

export default ListingsPageSkeleton;
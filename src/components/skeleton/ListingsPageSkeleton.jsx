import { PageContainer, ListingTable } from '@/components/ui';
import Skeleton from './Skeleton';
import { SkeletonLoading } from './SkeletonLoading';

/**
 * ListingsPageSkeleton — mirrors the Listed Items page with pixel precision:
 * Subtitle & action buttons, SegmentedTabs toggle, card container,
 * status filter pills, search & filter dropdown controls,
 * auto-adapting ListingTable (desktop table & mobile cards), and pagination footer.
 */
export function ListingsPageSkeleton() {
  return (
    <PageContainer>
      <SkeletonLoading label="Loading listings…" className="w-full">
        {/* ── Subtitle & Top Action Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <Skeleton className="h-3.5 w-80 sm:w-96 max-w-full" rounded="rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-28 rounded-xl" />
            <Skeleton className="h-9 w-36 rounded-xl" />
          </div>
        </div>

        {/* ── View Switcher: SegmentedTabs Skeleton ── */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl w-fit border border-slate-200 mb-4">
          <Skeleton className="h-7 w-44 rounded-lg" />
          <Skeleton className="h-7 w-40 rounded-lg" />
        </div>

        {/* ── Table & Filter Card Container ── */}
        <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden">
          {/* Status Tabs Bar */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <Skeleton className="h-7 w-16 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-20 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-22 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-24 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-36 rounded-lg shrink-0" />
              <Skeleton className="h-7 w-24 rounded-lg shrink-0" />
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-3 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
            <div className="flex-1">
              <Skeleton className="h-8 w-full rounded-lg" />
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <Skeleton className="h-8 w-full sm:w-44 rounded-lg shrink-0" />
              <Skeleton className="h-8 w-full sm:w-44 rounded-lg shrink-0" />
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>

          {/* Auto-adapting Listing Table (Desktop table & Mobile cards) */}
          <ListingTable
            loading={true}
            skeletonRows={8}
            columns={['product', 'category', 'location', 'date', 'status', 'actions']}
            portal="lister"
          />

          {/* Pagination Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
            <Skeleton className="h-3.5 w-36" rounded="rounded" />
            <div className="flex items-center gap-1">
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
              <Skeleton className="h-7 w-7 rounded-md" />
            </div>
          </div>
        </div>
      </SkeletonLoading>
    </PageContainer>
  );
}

export default ListingsPageSkeleton;

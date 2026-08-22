import SkeletonBase from '@/components/skeleton/Skeleton';
import SkeletonButton from '@/components/skeleton/SkeletonButton';

/**
 * Legacy aliases — kept so existing imports keep working. All rendering is
 * delegated to the shared skeleton system in @/components/skeleton.
 */
export function Skeleton(props) {
  return <SkeletonBase {...props} />;
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <SkeletonBase className="h-10 w-10" />
        <SkeletonBase className="h-3 w-24" rounded="rounded" />
      </div>
      <SkeletonBase className="h-7 w-16 mb-1" rounded="rounded-lg" />
      <SkeletonBase className="h-2.5 w-20" rounded="rounded" />
    </div>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-card">
      <div className="flex">
        <SkeletonBase className="w-32 h-32 rounded-none" />
        <div className="flex-1 p-4 space-y-5">
          <SkeletonBase className="h-4 w-3/4" rounded="rounded-md" />
          <SkeletonBase className="h-3 w-full" rounded="rounded" />
          <SkeletonBase className="h-3 w-1/2" rounded="rounded" />
          <div className="flex justify-between pt-2">
            <SkeletonBase className="h-3 w-20" rounded="rounded" />
            <SkeletonButton className="h-8 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
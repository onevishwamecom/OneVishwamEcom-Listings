import { SectionCard } from './UIComponents';
import Badge from '@/components/ui/Badge';
import { Link } from 'react-router-dom';

export function StatusCard({ listing, config, categoryInfo, subcategory, adminFeedback, formatDate, getDisplayId }) {
  return (
    <SectionCard title="Status & Details" icon="fa-circle-info" className="sticky top-20">
      <div className="space-y-4">
        <Badge variant={config.variant} icon={config.icon} className="w-full justify-center py-1.5 text-xs font-bold">
          {config.label}
        </Badge>

        <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Created</span>
            <span className="font-semibold text-slate-800">{formatDate(listing.createdAt)}</span>
          </div>
          {listing.updatedAt && (
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Last Updated</span>
              <span className="font-semibold text-slate-800">{formatDate(listing.updatedAt)}</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Category</span>
            <span className="font-semibold text-slate-800">{categoryInfo.label}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-500 font-medium">Subcategory</span>
            <span className="font-semibold text-slate-800">{subcategory || '—'}</span>
          </div>
        </div>

        {/* Status-specific messaging */}
        <div className={`p-3 rounded-xl text-xs ${
          listing.status === 'pending' ? 'bg-amber-50 border border-amber-200/80 text-amber-900' :
          listing.status === 'approved' ? 'bg-emerald-50 border border-emerald-200/80 text-emerald-900' :
          listing.status === 'cancelled' || listing.status === 'rejected' ? 'bg-rose-50 border border-rose-200/80 text-rose-900' :
          'bg-purple-50 border border-purple-200/80 text-purple-900'
        }`}>
          {listing.status === 'pending' && (
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-clock text-amber-600 mt-0.5 shrink-0 text-xs" />
              <div>
                <p className="font-bold text-amber-900 text-xs">Pending Approval</p>
                <p className="text-[11px] text-amber-700/90 mt-0.5">Submitted and awaiting admin review.</p>
              </div>
            </div>
          )}
          {listing.status === 'approved' && (
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-circle-check text-emerald-600 mt-0.5 shrink-0 text-xs" />
              <div>
                <p className="font-bold text-emerald-900 text-xs">Approved & Active</p>
                <p className="text-[11px] text-emerald-700/90 mt-0.5">Listing is active and approved.</p>
              </div>
            </div>
          )}
          {(listing.status === 'cancelled' || listing.status === 'rejected') && (
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-circle-xmark text-rose-600 mt-0.5 shrink-0 text-xs" />
              <div>
                <p className="font-bold text-rose-900 text-xs">Listing Cancelled</p>
                <p className="text-[11px] text-rose-700/90 mt-0.5">This listing has been cancelled by the admin.</p>
              </div>
            </div>
          )}
          {listing.status === 'changes-required' && (
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-triangle-exclamation text-purple-600 mt-0.5 shrink-0 text-xs" />
              <div>
                <p className="font-bold text-purple-900 text-xs">Changes Required</p>
                <p className="text-[11px] text-purple-700/90 mt-0.5">Please review admin feedback and re-submit.</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Feedback / Cancellation Reason */}
        {(adminFeedback || listing.adminComment) && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80">
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-comment-dots text-rose-500 mt-0.5 shrink-0 text-xs" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-rose-900 text-xs mb-0.5">
                  {listing.status === 'cancelled' || listing.status === 'rejected' ? 'Cancellation Reason' : 'Admin Feedback'}
                </p>
                <p className="text-xs text-rose-800 italic break-words">"{adminFeedback || listing.adminComment}"</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/add-listing?edit=${listing._id || listing.id}&type=${listing._type || listing.category || 'properties'}`}
            className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-150 ${
              listing.status === 'approved'
                ? 'bg-brand-blue text-white hover:bg-blue-600 shadow-xs'
                : listing.status === 'changes-required'
                ? 'bg-brand-gold text-brand-navy hover:bg-brand-gold/90 shadow-xs'
                : 'bg-slate-100 text-slate-800 border border-slate-200/80 hover:bg-slate-200'
            }`}
          >
            <i className="fa-solid fa-pen text-xs" aria-hidden="true" />
            {listing.status === 'approved' ? 'Edit & Resubmit' : 'Edit Listing'}
          </Link>

          <Link
            to="/listings"
            className="inline-flex items-center justify-center gap-1.5 bg-white text-slate-600 border border-slate-200 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" /> Back to Listings
          </Link>
        </div>
      </div>
    </SectionCard>
  );
}
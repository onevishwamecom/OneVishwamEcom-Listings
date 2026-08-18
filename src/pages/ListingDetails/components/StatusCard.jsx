import { SectionCard } from './UIComponents';
import Badge from '@/components/ui/Badge';
import { Link } from 'react-router-dom';

export function StatusCard({ listing, config, categoryInfo, subcategory, adminFeedback, formatDate, getDisplayId }) {
  return (
    <SectionCard title="Status" icon="fa-circle-info" className="sticky top-24">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-1">Listing ID</p>
          <p className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 border border-slate-200 px-3 py-1 text-sm font-bold text-brand-blue font-mono mb-3">
            <i className="fa-solid fa-hashtag text-xs" aria-hidden="true" />
            {getDisplayId(listing)}
          </p>
        </div>

        <Badge variant={config.variant} icon={config.icon} className="w-full justify-center py-2 text-sm">
          {config.label}
        </Badge>

        <div className="pt-4 border-t border-slate-100 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-500">Created</span>
            <span className="font-semibold text-slate-900">{formatDate(listing.createdAt)}</span>
          </div>
          {listing.updatedAt && (
            <div className="flex justify-between">
              <span className="text-slate-500">Last Updated</span>
              <span className="font-semibold text-slate-900">{formatDate(listing.updatedAt)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-slate-500">Category</span>
            <span className="font-semibold text-slate-900">{categoryInfo.label}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Subcategory</span>
            <span className="font-semibold text-slate-900">{subcategory}</span>
          </div>
        </div>

        {/* Status-specific messaging */}
        <div className={`p-4 rounded-xl ${
          listing.status === 'pending' ? 'bg-amber-50 border border-amber-200' :
          listing.status === 'approved' ? 'bg-brand-gold/10 border border-brand-gold/30' :
          'bg-brand-orange/10 border border-brand-orange/30'
        }`}>
          {listing.status === 'pending' && (
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-clock text-brand-gold mt-0.5" />
              <div>
                <p className="font-bold text-amber-800">Pending Approval</p>
                <p className="text-sm text-amber-700 mt-1">Your listing has been submitted and is waiting for admin review.</p>
              </div>
            </div>
          )}
          {listing.status === 'approved' && (
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-circle-check text-brand-gold mt-0.5" />
              <div>
                <p className="font-bold text-brand-gold">Approved</p>
                <p className="text-sm text-brand-gold/90 mt-1">Your listing has been approved and is now eligible for publication.</p>
              </div>
            </div>
          )}
          {listing.status === 'changes-required' && (
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-triangle-exclamation text-brand-orange mt-0.5" />
              <div>
                <p className="font-bold text-brand-orange">Changes Required</p>
                <p className="text-sm text-brand-orange/90 mt-1">Please review the admin feedback and update your listing.</p>
              </div>
            </div>
          )}
        </div>

        {/* Admin Feedback */}
        {adminFeedback && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <i className="fa-solid fa-comment-dots text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-red-800 mb-2">Admin Feedback</p>
                <p className="text-sm text-red-700 italic">"{adminFeedback}"</p>
                <p className="text-xs text-red-500 mt-2">Requested on {formatDate(listing.updatedAt || listing.createdAt)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          {listing.status === 'changes-required' && (
            <Link
              to={`/add-listing?edit=${listing._id}&type=${listing._type}`}
              className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-5 py-3 rounded-2xl font-bold text-sm hover:bg-brand-gold/90 transition-all duration-200 hover:-translate-y-0.5 shadow-glow-gold"
            >
              <i className="fa-solid fa-pen text-xs" aria-hidden="true" /> Edit Listing
            </Link>
          )}

          {listing.status === 'pending' && (
            <Link
              to={`/add-listing?edit=${listing._id}&type=${listing._type}`}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-pen text-xs" aria-hidden="true" /> Edit Listing
            </Link>
          )}

          {listing.status === 'approved' && (
            <Link
              to={`/add-listing?edit=${listing._id}&type=${listing._type}`}
              className="inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 border border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all duration-200 hover:-translate-y-0.5"
            >
              <i className="fa-solid fa-pen text-xs" aria-hidden="true" /> Edit Listing
            </Link>
          )}

          <Link
            to="/listings"
            className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border-2 border-slate-200 px-5 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            <i className="fa-solid fa-arrow-left text-xs" aria-hidden="true" /> Back to Listings
          </Link>
        </div>
      </div>
    </SectionCard>
  );
}
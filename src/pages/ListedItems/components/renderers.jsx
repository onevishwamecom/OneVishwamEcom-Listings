import { memo } from 'react';
import { Link } from 'react-router-dom';
import Badge from '@/components/ui/Badge';
import { getDisplayId, formatDate } from '@/utils';
import { STATUS_BADGE, SERVICE_CONFIG } from '../constants';

/** Memoized action cell to prevent re-renders when parent re-renders */
const ActionCell = memo(function ActionCell({ item, align, busyId, handleDelete }) {
  const id = getDisplayId(item);
  const status = item.status || 'pending';
  const busy = busyId === id;
  const editLink = `/add-listing?edit=${item._id}&type=${item._type}`;

  return (
    <div className={`flex items-center gap-2 ${align === 'end' ? 'justify-end' : ''}`}>
      <Link
        to={`/listings/${id}`}
        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-blue/10 text-brand-blue font-bold text-xs hover:bg-brand-blue hover:text-white transition-colors"
        title="View Listing"
      >
        <i className="fa-solid fa-eye text-sm" aria-hidden="true" />
        View
      </Link>

      {status === 'changes-required' && (
        <Link
          to={editLink}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-brand-gold hover:text-brand-navy transition-colors"
          title="Edit Listing"
        >
          <i className="fa-solid fa-pen text-sm" aria-hidden="true" />
          Edit
        </Link>
      )}

      {status === 'approved' && (
        <Link
          to={editLink}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-blue/10 text-brand-blue font-bold text-xs hover:bg-brand-blue hover:text-white transition-colors"
          title="Edit & Resubmit"
        >
          <i className="fa-solid fa-pen text-sm" aria-hidden="true" />
          Edit
        </Link>
      )}

      <button
        onClick={() => handleDelete(item, item._type)}
        disabled={busy}
        className="w-9 h-9 rounded-xl bg-brand-orange/10 text-brand-orange border border-brand-orange/25 hover:bg-brand-orange/20 hover:text-brand-orange flex items-center justify-center transition-colors disabled:opacity-50"
        aria-label={`Delete ${item.title || item.name || item.brand || 'listing'}`}
        title="Delete Listing"
      >
        {busy ? (
          <i className="fa-solid fa-spinner fa-spin text-sm" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-trash text-sm" aria-hidden="true" />
        )}
      </button>
    </div>
  );
});

export function renderActions(item, align = 'start', busyId, handleDelete) {
  return <ActionCell item={item} align={align} busyId={busyId} handleDelete={handleDelete} />;
}

/** Memoized status badge */
const StatusCell = memo(function StatusCell({ item }) {
  const cfg = STATUS_BADGE[item.status] || STATUS_BADGE.pending;
  return <Badge variant={cfg.variant} icon={cfg.icon}>{cfg.label}</Badge>;
});

export function renderStatus(item) {
  return <StatusCell item={item} />;
}

/** Memoized product cell */
const ProductCell = memo(function ProductCell({ item }) {
  const images = Array.isArray(item?.images) ? item.images : item?.image ? [item.image] : [];
  const title = item?.title || item?.name || item?.brand || 'Untitled';
  return (
    <div className="flex items-center gap-3 min-w-0">
      {images.length > 0 ? (
        <img
          src={images[0]}
          alt={title}
          loading="lazy"
          className="h-11 w-11 rounded-xl bg-slate-100 border border-slate-100 object-cover shrink-0"
        />
      ) : (
        <div className="h-11 w-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
          <i className="fa-solid fa-box text-sm" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
        <p className="text-xs font-semibold text-slate-400 truncate font-mono">{getDisplayId(item)}</p>
      </div>
    </div>
  );
});

export function renderProductCell(item) {
  return <ProductCell item={item} />;
}

/** Memoized category cell */
const CategoryCell = memo(function CategoryCell({ item }) {
  const config = SERVICE_CONFIG[item._type] || { label: item._type, icon: 'fa-box', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  return (
    <div className="flex items-center gap-2">
      <span className={`h-8 w-8 rounded-lg border flex items-center justify-center ${config.color}`}>
        <i className={`fa-solid ${config.icon} text-xs`} aria-hidden="true" />
      </span>
      <span className="text-sm font-semibold text-slate-700">{config.label}</span>
    </div>
  );
});

export function renderCategory(item) {
  return <CategoryCell item={item} />;
}

/** Memoized location cell */
const LocationCell = memo(function LocationCell({ item }) {
  const location = item?.location || item?.city || item?.area || '—';
  return (
    <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
      <i className="fa-solid fa-location-dot text-xs text-slate-300" aria-hidden="true" />
      <span className="truncate max-w-[160px]">{location}</span>
    </span>
  );
});

export function renderLocation(item) {
  return <LocationCell item={item} />;
}

/** Memoized date cell */
const DateCell = memo(function DateCell({ item }) {
  return (
    <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5">
      <i className="fa-regular fa-clock text-xs text-slate-300" aria-hidden="true" />
      {formatDate(item?.createdAt)}
    </span>
  );
});

export function renderDate(item) {
  return <DateCell item={item} />;
}

/** Memoized mobile card */
const MobileCard = memo(function MobileCard({ item, index, renderActions, renderStatus }) {
  const config = SERVICE_CONFIG[item._type] || { label: item._type, icon: 'fa-box', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  const images = Array.isArray(item?.images) ? item.images : item?.image ? [item.image] : [];
  const title = item?.title || item?.name || item?.brand || 'Untitled';
  const location = item?.location || item?.city || item?.area || '—';

  return (
    <div
      className="p-4 sm:p-5 flex flex-col gap-3 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex gap-4">
        {images.length > 0 ? (
          <img
            src={images[0]}
            alt={title}
            loading="lazy"
            className="h-16 w-16 rounded-xl bg-slate-100 border border-slate-100 object-cover shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 shrink-0">
            <i className={`fa-solid ${config.icon} text-xl`} aria-hidden="true" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{title}</p>
          <p className="text-xs font-semibold text-slate-400 truncate font-mono">{getDisplayId(item)}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${config.color}`}>
              <i className={`fa-solid ${config.icon} text-[10px]`} aria-hidden="true" />
              {config.label}
            </span>
            {renderStatus(item)}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-slate-500">
        <span className="flex items-center gap-1.5 min-w-0">
          <i className="fa-solid fa-location-dot text-slate-300" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </span>
        <span className="flex items-center gap-1.5 shrink-0">
          <i className="fa-regular fa-clock text-slate-300" aria-hidden="true" />
          {formatDate(item?.createdAt)}
        </span>
      </div>

      <div className="pt-3 border-t border-slate-100">{renderActions(item)}</div>
    </div>
  );
});

export function renderMobileCard(item, index, renderActions, renderStatus) {
  return <MobileCard key={getDisplayId(item)} item={item} index={index} renderActions={renderActions} renderStatus={renderStatus} />;
}

/** Memoized table row */
const TableRow = memo(function TableRow({ item, index, renderActions, renderProductCell, renderCategory, renderLocation, renderDate, renderStatus }) {
  return (
    <tr
      className="hover:bg-slate-50/60 transition-colors opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 40}ms`, animationFillMode: 'forwards' }}
    >
      <td className="px-5 py-4">{renderProductCell(item)}</td>
      <td className="px-4 py-4">{renderCategory(item)}</td>
      <td className="px-4 py-4">{renderLocation(item)}</td>
      <td className="px-4 py-4">{renderDate(item)}</td>
      <td className="px-4 py-4">{renderStatus(item)}</td>
      <td className="px-5 py-4">{renderActions(item, 'end')}</td>
    </tr>
  );
});

export function renderTableRow(item, index, renderActions, renderProductCell, renderCategory, renderLocation, renderDate, renderStatus) {
  return <TableRow key={getDisplayId(item)} item={item} index={index} renderActions={renderActions} renderProductCell={renderProductCell} renderCategory={renderCategory} renderLocation={renderLocation} renderDate={renderDate} renderStatus={renderStatus} />;
}
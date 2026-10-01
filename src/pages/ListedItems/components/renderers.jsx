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
  const itemRealId = item._id || item.id;
  const itemType = item._type || item.category || 'properties';
  const editLink = `/add-listing?edit=${itemRealId}&type=${itemType}`;

  return (
    <div className={`flex items-center gap-1.5 ${align === 'end' ? 'justify-end' : ''}`}>
      <Link
        to={editLink}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs transition-all duration-150 ${
          status === 'approved'
            ? 'bg-blue-50 text-brand-blue hover:bg-brand-blue hover:text-white border border-blue-200/60'
            : status === 'changes-required'
            ? 'bg-amber-50 text-amber-800 hover:bg-amber-400 hover:text-slate-900 border border-amber-200/60'
            : status === 'cancelled' || status === 'rejected'
            ? 'bg-rose-50 text-rose-700 hover:bg-rose-500 hover:text-white border border-rose-200/60'
            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200/60'
        }`}
        title={status === 'cancelled' || status === 'rejected' ? 'Edit & Reapply for Approval' : status === 'approved' ? 'Edit & Resubmit' : 'Edit Listing'}
      >
        <i className="fa-solid fa-pen text-[11px]" aria-hidden="true" />
        {status === 'cancelled' || status === 'rejected' ? 'Edit & Reapply' : 'Edit'}
      </Link>

      <button
        onClick={() => handleDelete(item, itemType)}
        disabled={busy}
        className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/60 hover:bg-rose-500 hover:text-white flex items-center justify-center transition-all duration-150 disabled:opacity-40 shrink-0"
        aria-label={`Delete ${item.title || item.name || item.brand || 'listing'}`}
        title="Delete Listing"
      >
        {busy ? (
          <i className="fa-solid fa-spinner fa-spin text-xs" aria-hidden="true" />
        ) : (
          <i className="fa-solid fa-trash text-xs" aria-hidden="true" />
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
  const id = getDisplayId(item);
  const images = Array.isArray(item?.images) ? item.images : item?.image ? [item.image] : [];
  const title = item?.title || item?.name || item?.brand || 'Untitled';
  const detailLink = `/listings/${id}`;
  const comment = item?.adminComment;
  const isCancelled = item?.status === 'cancelled' || item?.status === 'rejected';

  return (
    <Link to={detailLink} className="flex items-center gap-3 min-w-0 group hover:opacity-95">
      {images.length > 0 ? (
        <img
          src={images[0]}
          alt={title}
          loading="lazy"
          className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200/70 object-cover shrink-0 group-hover:scale-105 transition-transform"
        />
      ) : (
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/70 border border-slate-200/70 flex items-center justify-center text-slate-400 shrink-0">
          <i className="fa-solid fa-box text-xs" aria-hidden="true" />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-slate-900 truncate group-hover:text-brand-blue transition-colors">
          {title}
        </p>
        {isCancelled && comment && (
          <p className="text-[11px] font-medium text-rose-600 truncate mt-0.5 flex items-center gap-1">
            <i className="fa-solid fa-circle-exclamation text-[10px]" aria-hidden="true" />
            Reason: {comment}
          </p>
        )}
        {item?.status === 'changes-required' && comment && (
          <p className="text-[11px] font-medium text-amber-600 truncate mt-0.5 flex items-center gap-1">
            <i className="fa-solid fa-pen-to-square text-[10px]" aria-hidden="true" />
            Reason: {comment}
          </p>
        )}
      </div>
    </Link>
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
      <span className={`h-7 w-7 rounded-lg border flex items-center justify-center ${config.color} shrink-0`}>
        <i className={`fa-solid ${config.icon} text-[11px]`} aria-hidden="true" />
      </span>
      <span className="text-xs font-semibold text-slate-700 truncate">{config.label}</span>
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
    <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
      <i className="fa-solid fa-location-dot text-[11px] text-slate-400 shrink-0" aria-hidden="true" />
      <span className="truncate max-w-[150px]">{location}</span>
    </span>
  );
});

export function renderLocation(item) {
  return <LocationCell item={item} />;
}

/** Memoized date cell */
const DateCell = memo(function DateCell({ item }) {
  return (
    <span className="text-xs font-medium text-slate-600 flex items-center gap-1.5">
      <i className="fa-regular fa-clock text-[11px] text-slate-400 shrink-0" aria-hidden="true" />
      {formatDate(item?.createdAt)}
    </span>
  );
});

export function renderDate(item) {
  return <DateCell item={item} />;
}

/** Memoized mobile card */
const MobileCard = memo(function MobileCard({ item, index, renderActions, renderStatus }) {
  const id = getDisplayId(item);
  const detailLink = `/listings/${id}`;
  const config = SERVICE_CONFIG[item._type] || { label: item._type, icon: 'fa-box', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  const images = Array.isArray(item?.images) ? item.images : item?.image ? [item.image] : [];
  const title = item?.title || item?.name || item?.brand || 'Untitled';
  const location = item?.location || item?.city || item?.area || '—';

  return (
    <div
      className="p-3.5 flex flex-col gap-2.5 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex gap-3">
        <Link to={detailLink} className="shrink-0 group">
          {images.length > 0 ? (
            <img
              src={images[0]}
              alt={title}
              loading="lazy"
              className="h-14 w-14 rounded-xl bg-slate-100 border border-slate-200/70 object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <i className={`fa-solid ${config.icon} text-lg`} aria-hidden="true" />
            </div>
          )}
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={detailLink} className="text-xs font-bold text-slate-900 truncate block hover:text-brand-blue transition-colors">
            {title}
          </Link>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.color}`}>
              <i className={`fa-solid ${config.icon} text-[9px]`} aria-hidden="true" />
              {config.label}
            </span>
            {renderStatus(item)}
          </div>
          {item?.adminComment && (item?.status === 'cancelled' || item?.status === 'rejected') && (
            <p className="text-[11px] font-medium text-rose-600 mt-1.5 bg-rose-50 px-2 py-1 rounded-lg border border-rose-200/60 flex items-center gap-1.5">
              <i className="fa-solid fa-circle-exclamation text-[10px] shrink-0" aria-hidden="true" />
              <span className="truncate">Reason: {item.adminComment}</span>
            </p>
          )}
          {item?.adminComment && item?.status === 'changes-required' && (
            <p className="text-[11px] font-medium text-amber-700 mt-1.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/60 flex items-center gap-1.5">
              <i className="fa-solid fa-pen-to-square text-[10px] shrink-0" aria-hidden="true" />
              <span className="truncate">Reason: {item.adminComment}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 pt-1">
        <span className="flex items-center gap-1 min-w-0">
          <i className="fa-solid fa-location-dot text-slate-400" aria-hidden="true" />
          <span className="truncate">{location}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          <i className="fa-regular fa-clock text-slate-400" aria-hidden="true" />
          {formatDate(item?.createdAt)}
        </span>
      </div>

      <div className="pt-2 border-t border-slate-100">{renderActions(item)}</div>
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
      className="hover:bg-slate-50/80 transition-colors opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
    >
      <td className="px-4 py-3">{renderProductCell(item)}</td>
      <td className="px-4 py-3">{renderCategory(item)}</td>
      <td className="px-4 py-3">{renderLocation(item)}</td>
      <td className="px-4 py-3">{renderDate(item)}</td>
      <td className="px-4 py-3">{renderStatus(item)}</td>
      <td className="px-4 py-3">{renderActions(item, 'end')}</td>
    </tr>
  );
});

export function renderTableRow(item, index, renderActions, renderProductCell, renderCategory, renderLocation, renderDate, renderStatus) {
  return <TableRow key={getDisplayId(item)} item={item} index={index} renderActions={renderActions} renderProductCell={renderProductCell} renderCategory={renderCategory} renderLocation={renderLocation} renderDate={renderDate} renderStatus={renderStatus} />;
}
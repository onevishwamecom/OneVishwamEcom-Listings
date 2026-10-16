import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  fetchBulkBatches,
  addItemToBatch,
  updateBatchItem,
  deleteBatchItem,
  deleteBatch,
} from '@/services/listings';
import { formatINR, formatDate } from '@/utils';
import BatchItemModal from './BatchItemModal';
import { Skeleton } from '@/components/skeleton';
import {
  ListingTable,
  Button,
  IconButton,
  SearchInput,
} from '@/components/ui';

export default function BulkBatchesView() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryBatchId = searchParams.get('batchId');
  const queryOpenMedia = searchParams.get('openMedia');

  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedBatchIds, setExpandedBatchIds] = useState(new Set());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal state
  const [modalState, setModalState] = useState({
    isOpen: false,
    batchId: null,
    batchCategory: 'properties',
    item: null, // null for add, object for edit
  });
  const [isSaving, setIsSaving] = useState(false);
  const [busyItemId, setBusyItemId] = useState(null);

  const loadBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBulkBatches();
      const list = Array.isArray(data) ? data : [];
      setBatches(list);

      // Expand target batch from query params or first batch by default
      if (queryBatchId) {
        setExpandedBatchIds(new Set([queryBatchId]));
        const targetBatch = list.find((b) => b.batchId === queryBatchId);
        if (targetBatch && queryOpenMedia === '1' && targetBatch.items?.length > 0) {
          handleOpenEditModal(targetBatch, targetBatch.items[0]);
          const next = new URLSearchParams(searchParams);
          next.delete('openMedia');
          setSearchParams(next, { replace: true });
        }
      } else if (list.length > 0) {
        setExpandedBatchIds(new Set([list[0].batchId]));
      }
    } catch (err) {
      console.error('Failed to load bulk batches:', err);
      setError('Could not load bulk upload batches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBatches();
  }, []);

  // Toggle batch accordion
  const toggleBatch = (batchId) => {
    setExpandedBatchIds((prev) => {
      const next = new Set(prev);
      if (next.has(batchId)) {
        next.delete(batchId);
      } else {
        next.add(batchId);
      }
      return next;
    });
  };

  // Expand / collapse all
  const expandAll = () => {
    setExpandedBatchIds(new Set(batches.map((b) => b.batchId)));
  };

  const collapseAll = () => {
    setExpandedBatchIds(new Set());
  };

  // Open Add Item Modal
  const handleOpenAddModal = (batch) => {
    setModalState({
      isOpen: true,
      batchId: batch.batchId,
      batchCategory: batch.category || 'properties',
      item: null,
    });
  };

  // Open Edit Item Modal
  const handleOpenEditModal = (batch, item) => {
    setModalState({
      isOpen: true,
      batchId: batch.batchId,
      batchCategory: batch.category || 'properties',
      item,
    });
  };

  // Close Modal
  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      batchId: null,
      batchCategory: 'properties',
      item: null,
    });
  };

  // Save (Add or Edit) item
  const handleSaveItem = async (payload) => {
    const { batchId, item } = modalState;
    if (!batchId) return;

    setIsSaving(true);
    try {
      if (item) {
        // Edit
        const itemId = item._id || item.itemId;
        await updateBatchItem(batchId, itemId, payload);
        Swal.fire({
          icon: 'success',
          title: 'Item Updated',
          text: 'The listing details have been updated in pending review phase.',
          timer: 1600,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      } else {
        // Add
        await addItemToBatch(batchId, payload);
        Swal.fire({
          icon: 'success',
          title: 'Item Added',
          text: 'New product added to this batch in pending review phase.',
          timer: 1600,
          showConfirmButton: false,
          toast: true,
          position: 'top-end',
        });
      }

      handleCloseModal();
      await loadBatches();
    } catch (err) {
      console.error('Failed to save batch item:', err);
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: err.response?.data?.message || err.message || 'Something went wrong.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Delete item
  const handleDeleteItem = async (batchId, item) => {
    const itemId = item._id || item.itemId;
    const title = item.title || item.name || 'this item';

    const { isConfirmed } = await Swal.fire({
      title: 'Delete Item from Batch?',
      text: `Are you sure you want to remove "${title}" from this bulk batch?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
      },
    });

    if (!isConfirmed) return;

    setBusyItemId(itemId);
    try {
      await deleteBatchItem(batchId, itemId);
      Swal.fire({
        icon: 'success',
        title: 'Item Deleted',
        text: 'Item has been removed from this bulk batch.',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      await loadBatches();
    } catch (err) {
      console.error('Failed to delete batch item:', err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Could not delete item from batch.',
      });
    } finally {
      setBusyItemId(null);
    }
  };

  // Delete batch
  const handleDeleteBatch = async (batch) => {
    const { isConfirmed } = await Swal.fire({
      title: 'Delete Entire Bulk Batch?',
      html: `
        <div class="text-left text-sm space-y-2">
          <p>Are you sure you want to delete batch <b>${batch.batchId}</b>?</p>
          <div class="p-2.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg text-xs">
            <i class="fa-solid fa-triangle-exclamation mr-1"></i>
            This will permanently delete all <b>${batch.itemCount || batch.items?.length || 0} listings</b> associated with this batch.
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete batch',
      confirmButtonColor: '#ef4444',
      cancelButtonText: 'Cancel',
      customClass: {
        confirmButton: 'rounded-xl px-5 py-2.5 font-bold',
        cancelButton: 'rounded-xl px-5 py-2.5 font-bold',
      },
    });

    if (!isConfirmed) return;

    try {
      await deleteBatch(batch.batchId);
      Swal.fire({
        icon: 'success',
        title: 'Batch Deleted',
        text: 'The bulk batch and its items have been removed.',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      await loadBatches();
    } catch (err) {
      console.error('Failed to delete batch:', err);
      Swal.fire({
        icon: 'error',
        title: 'Delete Failed',
        text: 'Could not delete bulk batch.',
      });
    }
  };

  // Filtered batches
  const filteredBatches = useMemo(() => {
    let list = batches;
    if (categoryFilter !== 'all') {
      list = list.filter((b) => (b.category || '').toLowerCase() === categoryFilter.toLowerCase());
    }
    if (search.trim()) {
      const term = search.toLowerCase();
      list = list.filter((b) => {
        const idMatch = (b.batchId || '').toLowerCase().includes(term);
        const fileMatch = (b.filename || '').toLowerCase().includes(term);
        const catMatch = (b.category || '').toLowerCase().includes(term);
        const itemMatch = (b.items || []).some(
          (it) =>
            (it.title || it.name || '').toLowerCase().includes(term) ||
            (it.city || '').toLowerCase().includes(term) ||
            (it.subcategory || '').toLowerCase().includes(term)
        );
        return idMatch || fileMatch || catMatch || itemMatch;
      });
    }
    return list;
  }, [batches, categoryFilter, search]);

  const totalBatches = batches.length;
  const totalItemsAcrossBatches = batches.reduce((acc, b) => acc + (b.itemCount || b.items?.length || 0), 0);
  const totalPendingAcrossBatches = batches.reduce(
    (acc, b) => acc + (b.pendingCount || (b.items || []).filter((i) => i.status === 'pending').length),
    0
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-8 w-28" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* ── Summary & Filter Bar ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/70 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-layer-group text-emerald-600" /> Bulk Upload Batches
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {totalBatches} {totalBatches === 1 ? 'Batch' : 'Batches'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
              {totalPendingAcrossBatches} Pending Review
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Retractable grouped tables organized by bulk upload. All items start in pending phase where you can add, edit, and delete.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={loadBatches}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            title="Refresh batches"
          >
            <i className="fa-solid fa-rotate text-[11px]" /> Refresh
          </button>
          <button
            type="button"
            onClick={expandAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-chevron-down text-[10px]" /> Expand All
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <i className="fa-solid fa-chevron-up text-[10px]" /> Collapse All
          </button>
          <Button
            to="/bulk-listing"
            variant="emerald"
            size="sm"
            icon="fa-file-excel"
          >
            Upload New Batch
          </Button>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_200px] gap-2">
        <SearchInput
          value={search}
          onChange={(val) => setSearch(val)}
          placeholder="Search by batch ID, filename, product title, city..."
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="appearance-none rounded-xl border bg-white px-3 py-2 text-xs font-medium outline-none transition-all duration-150 border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 text-slate-700"
        >
          <option value="all">All Categories</option>
          <option value="properties">Properties</option>
          <option value="vehicle">Vehicles</option>
          <option value="grocery">Groceries</option>
          <option value="garment">Garments</option>
          <option value="jewellery">Jewellery</option>
        </select>
      </div>

      {/* ── Empty State ── */}
      {filteredBatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/70 p-12 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <i className="fa-solid fa-file-excel text-2xl" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Bulk Upload Batches Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
            {batches.length === 0
              ? 'You have not uploaded any bulk listings yet. Download an official category Excel template and upload dozens of products at once!'
              : 'No batches match your current search or category filter. Try clearing your filters.'}
          </p>
          <div className="flex items-center justify-center gap-3">
            {batches.length > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategoryFilter('all');
                }}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/bulk-listing"
                className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs hover:bg-emerald-700 transition-colors"
              >
                <i className="fa-solid fa-cloud-arrow-up" /> Start Bulk Upload
              </Link>
            )}
          </div>
        </div>
      ) : (
        /* ── Grouped & Retractable Batches Accordion ── */
        <div className="space-y-4">
          {filteredBatches.map((batch) => {
            const isExpanded = expandedBatchIds.has(batch.batchId);
            const items = batch.items || [];
            const itemCount = batch.itemCount || items.length;
            const pendingCount =
              batch.pendingCount !== undefined
                ? batch.pendingCount
                : items.filter((i) => i.status === 'pending').length;
            const approvedCount =
              batch.approvedCount !== undefined
                ? batch.approvedCount
                : items.filter((i) => i.status === 'approved').length;

            return (
              <div
                key={batch.batchId}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all duration-200 hover:border-slate-300"
              >
                {/* ── Retractable Header ── */}
                <div
                  onClick={() => toggleBatch(batch.batchId)}
                  className={`p-4 cursor-pointer select-none transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-3 ${
                    isExpanded ? 'bg-slate-50/80 border-b border-slate-200/70' : 'hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <button
                      type="button"
                      aria-label={isExpanded ? 'Collapse batch table' : 'Expand batch table'}
                      className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-transform shrink-0 shadow-2xs mt-0.5 sm:mt-0"
                    >
                      <i
                        className={`fa-solid fa-chevron-down text-xs transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-brand-blue' : ''
                        }`}
                      />
                    </button>

                    <div className="w-9 h-9 rounded-xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-file-excel text-base" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-900 tracking-tight">
                          {batch.batchId}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                          {batch.category}
                        </span>
                        {pendingCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <i className="fa-solid fa-clock-rotate-left text-[9px]" /> {pendingCount} Pending
                          </span>
                        )}
                        {approvedCount > 0 && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                            <i className="fa-solid fa-circle-check text-[9px]" /> {approvedCount} Approved
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                        <span className="truncate max-w-[240px] text-slate-700 font-medium" title={batch.filename}>
                          <i className="fa-solid fa-file text-slate-400 mr-1" />
                          {batch.filename}
                        </span>
                        <span>·</span>
                        <span>
                          <i className="fa-solid fa-boxes-stacked text-slate-400 mr-1" />
                          <b>{itemCount}</b> items
                        </span>
                        <span>·</span>
                        <span>
                          <i className="fa-solid fa-calendar-days text-slate-400 mr-1" />
                          {formatDate(batch.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Batch Header Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end lg:self-auto" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="emerald-outline"
                      size="sm"
                      icon="fa-plus"
                      onClick={() => handleOpenAddModal(batch)}
                      title="Add a new product to this batch"
                    >
                      Add Item
                    </Button>

                    <IconButton
                      variant="danger-soft"
                      size="icon"
                      icon="fa-trash"
                      onClick={() => handleDeleteBatch(batch)}
                      title="Delete entire bulk batch"
                      aria-label="Delete entire bulk batch"
                    />
                  </div>
                </div>

                {/* ── Retractable Table of Items ── */}
                {isExpanded && (
                  <div className="animate-fade-in border-t border-slate-100">
                    {items.length === 0 ? (
                      <div className="p-8 text-center bg-slate-50/40">
                        <p className="text-xs text-slate-500 mb-2">No items remaining in this batch.</p>
                        <button
                          type="button"
                          onClick={() => handleOpenAddModal(batch)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue hover:underline"
                        >
                          <i className="fa-solid fa-plus" /> Add an item now
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <ListingTable
                          items={items}
                          columns={['product', 'subcategory', 'location', 'price', 'multimedia', 'status', 'actions']}
                          portal="lister"
                          getItemLink={(item) =>
                            `/listings/${item.itemId || item._id}?type=${encodeURIComponent(batch.category || item.category || 'properties')}`
                          }
                          busyId={busyItemId}
                          responsiveMode="scroll"
                          onEdit={(item) => handleOpenEditModal(batch, item)}
                          onDelete={(item) => handleDeleteItem(batch.batchId, item)}
                        />

                        {/* Batch Table Footer with Add button */}
                        <div className="px-4 py-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                          <p className="text-[11px] text-slate-500 font-medium">
                            Showing {items.length} items in batch <span className="font-mono">{batch.batchId}</span>
                          </p>
                          <button
                            type="button"
                            onClick={() => handleOpenAddModal(batch)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                          >
                            <i className="fa-solid fa-plus text-[10px]" /> Add Another Item
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <BatchItemModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        onSave={handleSaveItem}
        item={modalState.item}
        batchCategory={modalState.batchCategory}
        isSaving={isSaving}
      />
    </div>
  );
}

import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  PageContainer,
  EmptyState,
  ListingTable,
  ListingCard,
  Button,
  SegmentedTabs,
  FilterPills,
  SearchInput,
} from '@/components/ui';
import { ListingsPageSkeleton, ErrorState } from '@/components/skeleton';
import LottieFeedbackAnimation from '@/components/ui/LottieFeedbackAnimation';
import { STATUS_TABS, EMPTY_STATE, SERVICE_CONFIG, SORT_OPTIONS, PRIMARY_CATEGORIES } from './constants';
import { useListedItems } from './hooks/useListedItems';
import BulkBatchesView from './components/BulkBatchesView';

function ListedItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode = searchParams.get('view') === 'bulk' || searchParams.get('tab') === 'bulk' ? 'bulk' : 'items';
  const [layoutMode, setLayoutMode] = useState('table'); // 'table' | 'grid'

  const {
    loading,
    error,
    retry,
    busyId,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,
    activeTab,
    selectTab,
    statusCounts,
    filtered,
    setPage,
    currentPage,
    totalPages,
    pageItems,
    perPage,
    handleDelete,
  } = useListedItems();

  const activeEmpty = EMPTY_STATE[activeTab] || EMPTY_STATE.all;
  const tabHasItems = filtered.length > 0;
  const showNoResults = tabHasItems && filtered.length === 0;
  const showEmptyState = filtered.length === 0 && !showNoResults;

  if (loading) {
    return <ListingsPageSkeleton />;
  }

  return (
    <PageContainer>
      {/* ── Subtitle & Top Action Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <p className="text-xs text-slate-500 font-medium">Manage and track your submitted products across all review statuses</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            to="/bulk-listing"
            variant="emerald-outline"
            size="md"
            icon="fa-file-excel"
          >
            Bulk Upload
          </Button>
          <Button
            to="/add-listing"
            variant="action"
            size="md"
            icon="fa-plus"
          >
            List New Product
          </Button>
        </div>
      </div>

      {/* ── View Switcher: Individual Listings vs Grouped Bulk Batches ── */}
      <SegmentedTabs
        tabs={[
          {
            id: 'individual',
            label: `Individual Listings (${statusCounts.all})`,
            icon: 'fa-table-list',
          },
          {
            id: 'bulk',
            label: 'Bulk Upload Batches',
            icon: 'fa-layer-group',
            activeColor: 'emerald',
          },
        ]}
        activeTab={viewMode === 'bulk' ? 'bulk' : 'individual'}
        onChange={(tabId) => {
          const next = new URLSearchParams(searchParams);
          if (tabId === 'bulk') {
            next.set('view', 'bulk');
          } else {
            next.delete('view');
            next.delete('tab');
          }
          setSearchParams(next, { replace: true });
        }}
        className="mb-4"
      />

      {viewMode === 'bulk' ? (
        <BulkBatchesView />
      ) : error ? (
        <ErrorState
          icon="fa-triangle-exclamation"
          title="Unable to load listings"
          message="We couldn't load your listings. Please try again."
          onRetry={retry}
        />
      ) : (
        <>
          {/* ── Table & Filter Card Container ── */}
          <div className="bg-white rounded-2xl border border-slate-200/70 shadow-xs overflow-hidden animate-fade-in">
            
            {/* ── Status Tabs Bar ── */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/50">
              <FilterPills
                tabs={STATUS_TABS.map((tab) => ({
                  id: tab.id,
                  label: tab.label,
                  count: statusCounts[tab.id],
                }))}
                activeTab={activeTab}
                onChange={selectTab}
                ariaLabel="Listing statuses"
              />
            </div>

            {/* ── Search & Filter Controls ── */}
            <div className="p-3 border-b border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center gap-2">
              <div className="flex-1">
                <SearchInput
                  value={search}
                  onChange={(val) => setSearch(val)}
                  placeholder="Search by title, category, city..."
                  aria-label="Search listings"
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="relative w-full sm:w-44">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    aria-label="Filter by category"
                    className="w-full appearance-none rounded-lg border bg-white px-3 py-1.5 pr-7 text-xs font-medium outline-none transition-all duration-150 border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 hover:border-slate-300 text-slate-700"
                  >
                    <option value="all">All Categories</option>
                    {PRIMARY_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.key}>{cat.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                    <i className="fa-solid fa-chevron-down text-[10px]" aria-hidden="true" />
                  </div>
                </div>

                <div className="relative w-full sm:w-44">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort listings"
                    className="w-full appearance-none rounded-lg border bg-white px-3 py-1.5 pr-7 text-xs font-medium outline-none transition-all duration-150 border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 hover:border-slate-300 text-slate-700"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                    <i className="fa-solid fa-chevron-down text-[10px]" aria-hidden="true" />
                  </div>
                </div>

                {/* View Mode Toggle: Grid vs Table */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 shrink-0">
                  <button
                    type="button"
                    onClick={() => setLayoutMode('grid')}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all cursor-pointer ${
                      layoutMode === 'grid'
                        ? 'bg-white text-brand-blue shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Grid / Cards View"
                    aria-label="Grid / Cards View"
                  >
                    <i className="fa-solid fa-grip" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setLayoutMode('table')}
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs transition-all cursor-pointer ${
                      layoutMode === 'table'
                        ? 'bg-white text-brand-blue shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                    title="Table View"
                    aria-label="Table View"
                  >
                    <i className="fa-solid fa-list" />
                  </button>
                </div>
              </div>
            </div>

            {showEmptyState ? (
              <div className="p-4">
                <EmptyState
                  icon={activeEmpty.icon}
                  title={activeEmpty.title}
                  subtitle={activeEmpty.subtitle}
                  action={
                    activeEmpty.showCta ? (
                      <Button
                        to="/add-listing"
                        variant="primary"
                        size="md"
                        icon="fa-plus"
                      >
                        List New Product
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            ) : showNoResults ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4 animate-fade-in">
                <div className="mb-2">
                  <LottieFeedbackAnimation type="searchEmpty" size="md" fallbackIcon="fa-solid fa-magnifying-glass-minus" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">No items match your search</h3>
                <p className="text-xs text-slate-500 mb-4">Try a different keyword, category or sort option.</p>
                <Button
                  variant="secondary"
                  size="sm"
                  icon="fa-rotate-left"
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('all');
                    setSort('newest');
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : layoutMode === 'grid' ? (
              <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 animate-fade-in">
                {pageItems.map((item, idx) => {
                  const targetId = item.itemId || item._id || item.id;
                  const cat = item._type || item.category || 'properties';
                  const detailUrl = targetId ? `/listings/${encodeURIComponent(targetId)}?type=${encodeURIComponent(cat)}&fromPage=${currentPage}` : '#';
                  const editUrl = targetId ? `/add-listing?edit=${encodeURIComponent(targetId)}&type=${encodeURIComponent(cat)}` : '#';
                  return (
                    <ListingCard
                      key={targetId || idx}
                      item={item}
                      detailUrl={detailUrl}
                      editUrl={editUrl}
                      onDelete={handleDelete}
                      isBusy={busyId === targetId}
                    />
                  );
                })}
              </div>
            ) : (
              <ListingTable
                items={pageItems}
                columns={['product', 'category', 'location', 'date', 'status', 'actions']}
                portal="lister"
                onDelete={handleDelete}
                busyId={busyId}
                currentPage={currentPage}
                perPage={perPage}
              />
            )}

            {/* Pagination */}
            {!showEmptyState && !showNoResults && totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 px-4 py-2.5 border-t border-slate-100 bg-slate-50/50">
                <p className="text-xs font-semibold text-slate-500">
                  Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length} items
                </p>
                <div className="flex items-center gap-1 flex-wrap justify-center sm:justify-end" role="navigation" aria-label="Listings pagination">
                  <button
                    type="button"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
                  >
                    <i className="fa-solid fa-chevron-left text-[9px]" aria-hidden="true" />
                  </button>

                  {getPageNumbers(currentPage, totalPages).map((value, i) =>
                    value === '…' ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-xs font-bold text-slate-400 select-none">…</span>
                    ) : (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setPage(value)}
                        aria-current={value === currentPage ? 'page' : undefined}
                        aria-label={`Page ${value}`}
                        className={`flex items-center justify-center w-7 h-7 rounded-md text-xs font-bold transition-all ${
                          value === currentPage
                            ? 'bg-brand-blue text-white shadow-xs'
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {value}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-xs"
                  >
                    <i className="fa-solid fa-chevron-right text-[9px]" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </PageContainer>
  );
}

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  // Near the beginning: 1 2 3 4 5 … total
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '…', total];
  }
  // Near the end: 1 … (total-4) (total-3) (total-2) (total-1) total
  if (current >= total - 3) {
    return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  }
  // In the middle: 1 … (current-1) current (current+1) … total
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export default ListedItems;
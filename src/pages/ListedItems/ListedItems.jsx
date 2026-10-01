import { Link } from 'react-router-dom';
import PageContainer from '@/components/ui/PageContainer';
import EmptyState from '@/components/ui/EmptyState';
import { ListingsPageSkeleton, ErrorState } from '@/components/skeleton';
import { STATUS_TABS, EMPTY_STATE, SERVICE_CONFIG, SORT_OPTIONS } from './constants';
import { useListedItems } from './hooks/useListedItems';
import { renderActions, renderStatus, renderMobileCard, renderTableRow, renderProductCell, renderCategory, renderLocation, renderDate } from './components/renderers';

function ListedItems() {
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

  const renderActionsBound = (item, align) => renderActions(item, align, busyId, handleDelete);
  const renderStatusBound = (item) => renderStatus(item);
  const renderMobileCardBound = (item, index) => renderMobileCard(item, index, renderActionsBound, renderStatusBound);
  const renderTableRowBound = (item, index) => renderTableRow(
    item, index, renderActionsBound, renderProductCell, renderCategory, renderLocation, renderDate, renderStatusBound
  );

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
        <Link
          to="/add-listing"
          className="inline-flex items-center justify-center gap-2 bg-brand-gold text-brand-navy px-4 py-2 rounded-xl font-bold text-xs shadow-xs hover:bg-brand-gold/90 transition-all duration-150 active:scale-[0.98] shrink-0"
        >
          <i className="fa-solid fa-plus text-xs" aria-hidden="true" /> List New Product
        </Link>
      </div>

      {error ? (
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
              <div className="overflow-x-auto scrollbar-hide">
                <nav className="flex gap-1 min-w-max items-center" aria-label="Listing statuses">
                  {STATUS_TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => selectTab(tab.id)}
                        aria-current={isActive ? 'page' : undefined}
                        className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all duration-150 ${
                          isActive
                            ? 'bg-brand-blue text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200/60 hover:text-slate-900'
                        }`}
                      >
                        {tab.label}
                        <span
                          className={`inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-md text-[10px] font-extrabold ${
                            isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {statusCounts[tab.id]}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* ── Search & Filter Controls ── */}
            <div className="p-3 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_180px_180px] gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <i className="fa-solid fa-magnifying-glass text-xs" aria-hidden="true" />
                </div>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by title, category, city..."
                  aria-label="Search listings"
                  className="w-full rounded-lg border bg-white pl-8 pr-3 py-1.5 text-xs outline-none transition-all duration-150 border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 hover:border-slate-300"
                />
              </div>

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  aria-label="Filter by category"
                  className="w-full appearance-none rounded-lg border bg-white px-3 py-1.5 pr-7 text-xs font-medium outline-none transition-all duration-150 border-slate-200 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 hover:border-slate-300 text-slate-700"
                >
                  <option value="all">All Categories</option>
                  {Object.entries(SERVICE_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
                  <i className="fa-solid fa-chevron-down text-[10px]" aria-hidden="true" />
                </div>
              </div>

              <div className="relative">
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
            </div>

            {showEmptyState ? (
              <div className="p-4">
                <EmptyState
                  icon={activeEmpty.icon}
                  title={activeEmpty.title}
                  subtitle={activeEmpty.subtitle}
                  action={
                    activeEmpty.showCta ? (
                      <Link
                        to="/add-listing"
                        className="inline-flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-brand-blue/90 transition-all duration-150"
                      >
                        <i className="fa-solid fa-plus text-xs" aria-hidden="true" /> List New Product
                      </Link>
                    ) : undefined
                  }
                />
              </div>
            ) : showNoResults ? (
              <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-2.5">
                  <i className="fa-solid fa-magnifying-glass-minus text-lg text-slate-400" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-0.5">No items match your search</h3>
                <p className="text-xs text-slate-500 mb-3">Try a different keyword, category or sort option.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('all');
                    setSort('newest');
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  <i className="fa-solid fa-rotate-left text-[10px]" aria-hidden="true" /> Clear filters
                </button>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-100">
                        <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Product</th>
                        <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Category</th>
                        <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Location</th>
                        <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Date</th>
                        <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Status</th>
                        <th className="px-4 py-2.5 text-[10px] uppercase tracking-wider font-extrabold text-slate-500 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {pageItems.map((item, index) => renderTableRowBound(item, index))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="lg:hidden divide-y divide-slate-100">
                  {pageItems.map((item, index) => renderMobileCardBound(item, index))}
                </div>
              </>
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
  const set = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push('…');
    out.push(p);
    prev = p;
  }
  return out;
}

export default ListedItems;
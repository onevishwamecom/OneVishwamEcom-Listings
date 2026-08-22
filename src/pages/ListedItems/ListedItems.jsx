import { Link } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
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
      <PageHeader
        title="Listed Items"
        subtitle="View and manage all your submitted products across every status"
        action={
          <Link
            to="/add-listing"
            className="inline-flex items-center gap-2 bg-brand-gold text-brand-navy px-6 py-3 rounded-2xl font-bold text-sm shadow-glow-gold hover:bg-brand-gold/90 transition-all duration-200 hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-plus" aria-hidden="true" /> List New Product
          </Link>
        }
      />

      {error ? (
        <ErrorState
          icon="fa-triangle-exclamation"
          title="Unable to load listings"
          message="We couldn't load your listings. Please try again."
          onRetry={retry}
        />
      ) : (
        <>
          {/* ── Status Tabs ── */}
      <div className="relative">
        <div className="overflow-x-auto pb-2 scrollbar-hide">
          <nav className="flex gap-2 min-w-max items-center px-1 py-1 bg-slate-200/50 rounded-2xl" aria-label="Listing statuses">
            {STATUS_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => selectTab(tab.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-blue to-brand-blue/80 text-white shadow-sm scale-105'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                  <span
                    className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full text-xs font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'
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

      {/* ── Table Card ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden animate-fade-in">
        {/* Search & Filters */}
        <div className="p-5 border-b border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_200px_200px] gap-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search listings..."
              aria-label="Search listings"
              className="w-full rounded-2xl border bg-slate-50/50 pl-11 pr-4 py-3.5 text-sm outline-none transition-all duration-200 border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              aria-label="Filter by category"
              className="w-full appearance-none rounded-2xl border bg-slate-50/50 px-4 py-3.5 pr-10 text-sm outline-none transition-all duration-200 border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
            >
              <option value="all">All Categories</option>
              {Object.entries(SERVICE_CONFIG).map(([key, cfg]) => (
                <option key={key} value={key}>{cfg.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
              <i className="fa-solid fa-chevron-down text-xs" aria-hidden="true" />
            </div>
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort listings"
              className="w-full appearance-none rounded-2xl border bg-slate-50/50 px-4 py-3.5 pr-10 text-sm outline-none transition-all duration-200 border-slate-200 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 focus:bg-white hover:border-slate-300"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400">
              <i className="fa-solid fa-chevron-down text-xs" aria-hidden="true" />
            </div>
          </div>
        </div>

        {showEmptyState ? (
          <div className="p-5">
            <EmptyState
              icon={activeEmpty.icon}
              title={activeEmpty.title}
              subtitle={activeEmpty.subtitle}
              action={
                activeEmpty.showCta ? (
                  <Link
                    to="/add-listing"
                    className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-brand-blue/90 transition-all duration-200 hover:-translate-y-0.5 shadow-float"
                  >
                    <i className="fa-solid fa-plus text-xs" aria-hidden="true" /> List New Product
                  </Link>
                ) : undefined
              }
            />
          </div>
        ) : showNoResults ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
              <i className="fa-solid fa-magnifying-glass-minus text-3xl text-slate-300" aria-hidden="true" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1.5">No items match your search</h3>
            <p className="text-sm text-slate-500 font-medium mb-5">Try a different keyword, category or sort option.</p>
            <button
              onClick={() => {
                setSearch('');
                setCategoryFilter('all');
                setSort('newest');
              }}
              className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              <i className="fa-solid fa-rotate-left text-xs" aria-hidden="true" /> Clear filters
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80">
                    <th className="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold text-slate-400">Product</th>
                    <th className="px-4 py-3.5 text-[11px] uppercase tracking-wider font-bold text-slate-400">Category</th>
                    <th className="px-4 py-3.5 text-[11px] uppercase tracking-wider font-bold text-slate-400">Location</th>
                    <th className="px-4 py-3.5 text-[11px] uppercase tracking-wider font-bold text-slate-400">Date</th>
                    <th className="px-4 py-3.5 text-[11px] uppercase tracking-wider font-bold text-slate-400">Status</th>
                    <th className="px-5 py-3.5 text-[11px] uppercase tracking-wider font-bold text-slate-400 text-right">Action</th>
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 py-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">
              Showing {(currentPage - 1) * perPage + 1}–{Math.min(currentPage * perPage, filtered.length)} of {filtered.length}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-end" role="navigation" aria-label="Listings pagination">
              <button
                type="button"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <i className="fa-solid fa-chevron-left text-xs" aria-hidden="true" />
              </button>

              {getPageNumbers(currentPage, totalPages).map((value, i) =>
                value === '…' ? (
                  <span key={`ellipsis-${i}`} className="px-1.5 text-sm font-bold text-slate-400 select-none">…</span>
                ) : (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPage(value)}
                    aria-current={value === currentPage ? 'page' : undefined}
                    aria-label={`Page ${value}`}
                    className={`flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold transition-all ${
                      value === currentPage
                        ? 'bg-gradient-to-r from-brand-blue to-brand-blue/80 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'
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
                className="flex items-center justify-center w-9 h-9 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
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
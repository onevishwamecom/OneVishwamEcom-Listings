import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useListingStats } from '@/components/ListingStats';
import { getDisplayId } from '@/utils';
import { parsePrice, PRICE_LIMITS, SERVICE_CONFIG, normalizeCategoryKey } from '../constants';
import useCachedData from '@/hooks/useCachedData';
import { fetchListings, deleteListing, invalidateListings } from '@/services/listings';
import { deleteMediaFromStorage } from '@/services/storageService';
import { getSavedDrafts, deleteDraft } from '@/services/draftsService';
import { CACHE_TTL } from '@/services/cacheService';
import { useDebouncedValue } from '@/hooks/useDebounce';
import SearchIndex from '@/utils/searchIndex';

export function useListedItems() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { refresh: refreshStats } = useListingStats();

  const [busyId, setBusyId] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const search = useDebouncedValue(searchInput, 300);

  const urlCategory = searchParams.get('category') || searchParams.get('type') || 'all';
  const [categoryFilter, setCategoryFilterState] = useState(urlCategory);

  const [sort, setSort] = useState('newest');
  const [priceRange] = useState({ ...PRICE_LIMITS });

  // Initialize page from URL searchParams or persistent sessionStorage
  const getInitialPage = () => {
    const fromUrl = parseInt(searchParams.get('page'), 10);
    if (fromUrl > 0) return fromUrl;
    const fromStorage = parseInt(sessionStorage.getItem('vishwam_listings_page'), 10);
    if (fromStorage > 0) return fromStorage;
    return 1;
  };

  const [page, setPageState] = useState(getInitialPage);
  const perPage = 8;

  const setPage = useCallback((newPage) => {
    const validPage = Math.max(1, Number(newPage) || 1);
    setPageState(validPage);
    sessionStorage.setItem('vishwam_listings_page', String(validPage));
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (validPage > 1) {
        next.set('page', String(validPage));
      } else {
        next.delete('page');
      }
      return next;
    }, { replace: true });
  }, [setSearchParams]);

  // Sync if searchParams changes from outside (e.g. browser back/forward buttons)
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page'), 10);
    if (urlPage > 0 && urlPage !== page) {
      setPageState(urlPage);
      sessionStorage.setItem('vishwam_listings_page', String(urlPage));
    }
  }, [searchParams]);

  const tabParam = searchParams.get('status');
  const activeTab = ['draft', 'pending', 'approved', 'changes-required', 'cancelled'].includes(tabParam) ? tabParam : 'all';
  const [draftsVersion, setDraftsVersion] = useState(0);

  useEffect(() => {
    const handleDraftsUpdated = () => setDraftsVersion((v) => v + 1);
    window.addEventListener('onevishwam_drafts_updated', handleDraftsUpdated);
    return () => window.removeEventListener('onevishwam_drafts_updated', handleDraftsUpdated);
  }, []);

  // Keep categoryFilter in sync if searchParams change
  useEffect(() => {
    const param = searchParams.get('category') || searchParams.get('type') || 'all';
    setCategoryFilterState(param);
  }, [searchParams]);

  const setCategoryFilter = useCallback((cat) => {
    setCategoryFilterState(cat);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') {
      next.delete('category');
      next.delete('type');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const { data: allListings, setData: setAllListings, loading, error, retry } = useCachedData(
    fetchListings,
    'listings',
    [],
    { ttl: CACHE_TTL.listings, fallback: {} },
  );

  // Only reset page to 1 if search or filters are genuinely changed by user
  const isMountedRef = useRef(false);
  const prevFiltersRef = useRef({ search, categoryFilter, sort, activeTab });

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      return;
    }
    const prev = prevFiltersRef.current;
    if (
      prev.search !== search ||
      prev.categoryFilter !== categoryFilter ||
      prev.sort !== sort ||
      prev.activeTab !== activeTab
    ) {
      prevFiltersRef.current = { search, categoryFilter, sort, activeTab };
      setPage(1);
    }
  }, [search, categoryFilter, sort, activeTab, setPage]);

  const selectTab = useCallback((id) => {
    const next = new URLSearchParams(searchParams);
    if (id === 'all') {
      next.delete('status');
    } else {
      next.set('status', id);
    }
    setSearchParams(next, { replace: true });
  }, [searchParams, setSearchParams]);

  const items = useMemo(() => {
    const all = [];
    for (const [type, arr] of Object.entries(allListings)) {
      if (Array.isArray(arr)) {
        arr.forEach((item) => all.push({ ...item, _type: type }));
      }
    }
    const drafts = getSavedDrafts();
    drafts.forEach((draft) => {
      all.push({
        ...draft,
        _type: draft.category || 'properties',
        status: 'draft',
      });
    });
    return all.sort((a, b) => new Date(b.createdAt || b.updatedAt || b.savedAt || 0) - new Date(a.createdAt || a.updatedAt || a.savedAt || 0));
  }, [allListings, draftsVersion]);

  // First filter items by selected category
  const categoryFiltered = useMemo(() => {
    if (categoryFilter === 'all') return items;
    const targetNorm = normalizeCategoryKey(categoryFilter);
    return items.filter((item) => {
      const itemTypeNorm = normalizeCategoryKey(item._type);
      const itemCatNorm = normalizeCategoryKey(item.category);
      return itemTypeNorm === targetNorm || itemCatNorm === targetNorm;
    });
  }, [items, categoryFilter]);

  // Status counts reflect the active category items
  const statusCounts = useMemo(() => {
    const counts = { all: categoryFiltered.length, draft: 0, pending: 0, approved: 0, 'changes-required': 0, cancelled: 0 };
    categoryFiltered.forEach((item) => {
      if (item.status === 'draft') counts.draft += 1;
      else if (item.status === 'pending') counts.pending += 1;
      else if (item.status === 'approved') counts.approved += 1;
      else if (item.status === 'changes-required') counts['changes-required'] += 1;
      else if (item.status === 'cancelled' || item.status === 'rejected') counts.cancelled += 1;
    });
    return counts;
  }, [categoryFiltered]);

  // Then filter by active status tab
  const tabFiltered = useMemo(() => {
    if (activeTab === 'all') return categoryFiltered;
    if (activeTab === 'cancelled') {
      return categoryFiltered.filter((item) => item.status === 'cancelled' || item.status === 'rejected');
    }
    return categoryFiltered.filter((item) => item.status === activeTab);
  }, [categoryFiltered, activeTab]);

  const searchIndex = useMemo(() => {
    const searchable = tabFiltered.map((item) => ({
      ...item,
      _displayId: getDisplayId(item),
      _catLabel: SERVICE_CONFIG[item._type]?.label || item._type,
    }));
    return new SearchIndex(searchable, ['title', 'name', 'brand', '_displayId', 'location', 'city', 'area', '_catLabel']);
  }, [tabFiltered]);

  const filtered = useMemo(() => {
    const term = search.trim();
    let list = tabFiltered;

    if (term) {
      const matched = searchIndex.search(term);
      const matchedIds = new Set(matched.map((m) => String(m._id || m.id || m._displayId)));
      list = list.filter((item) => matchedIds.has(String(item._id || item.id || getDisplayId(item))));
    }

    if (priceRange.min > PRICE_LIMITS.min || priceRange.max < PRICE_LIMITS.max) {
      list = list.filter((item) => {
        const p = parsePrice(item);
        return p >= priceRange.min && p <= priceRange.max;
      });
    }

    const sorted = [...list];
    switch (sort) {
      case 'oldest':
        sorted.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'price-low':
        sorted.sort((a, b) => parsePrice(a) - parsePrice(b));
        break;
      case 'price-high':
        sorted.sort((a, b) => parsePrice(b) - parsePrice(a));
        break;
      case 'name':
        sorted.sort((a, b) => (a.title || a.name || a.brand || '').localeCompare(b.title || b.name || b.brand || ''));
        break;
      default:
        sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }
    return sorted;
  }, [tabFiltered, search, searchIndex, sort, priceRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = loading || filtered.length === 0 ? page : Math.min(Math.max(1, page), totalPages);
  const pageItems = useMemo(
    () => filtered.slice((currentPage - 1) * perPage, currentPage * perPage),
    [filtered, currentPage, perPage],
  );

  const handleDelete = useCallback(async (item, type) => {
    const id = getDisplayId(item);
    if (!id) return;

    const { isConfirmed } = await Swal.fire({
      title: 'Delete listing?',
      text: 'This will permanently remove this listing. This action cannot be undone.',
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

    if (item?.status === 'draft' || String(id).startsWith('draft_')) {
      deleteDraft(id);
      setDraftsVersion((v) => v + 1);
      Swal.fire({
        icon: 'success',
        title: 'Draft Deleted',
        text: 'Draft removed successfully',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
      return;
    }

    setBusyId(id);
    try {
      // Clean up Firebase Storage files associated with this item if any
      const mediaUrls = [
        ...(Array.isArray(item?.images) ? item.images : []),
        ...(Array.isArray(item?.videos) ? item.videos : []),
        ...(Array.isArray(item?.documents) ? item.documents : []),
        item?.videoUrl,
        item?.video,
        item?.pdfUrl,
        item?.brochure,
      ].filter((u) => u && typeof u === 'string' && u.includes('firebasestorage'));

      await Promise.all(mediaUrls.map((url) => deleteMediaFromStorage(url)));

      await deleteListing(type, id);
      setAllListings((prev) => {
        const next = { ...prev };
        next[type] = (next[type] || []).filter((it) => getDisplayId(it) !== id);
        return next;
      });
      invalidateListings();
      refreshStats();
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Listing removed successfully',
        timer: 1600,
        showConfirmButton: false,
        toast: true,
        position: 'top-end',
      });
    } catch (err) {
      console.error('Failed to delete listing:', err);
      Swal.fire({
        icon: 'error',
        title: 'Delete failed',
        text: 'Something went wrong. Please try again.',
      });
    } finally {
      setBusyId(null);
    }
  }, [refreshStats, setAllListings]);

  return {
    loading,
    error,
    retry,
    busyId,
    search: searchInput,
    setSearch: setSearchInput,
    categoryFilter,
    setCategoryFilter,
    sort,
    setSort,
    activeTab,
    selectTab,
    statusCounts,
    filtered,
    page,
    setPage,
    currentPage,
    totalPages,
    pageItems,
    perPage,
    handleDelete,
  };
}
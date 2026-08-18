import { createContext, useContext, useMemo } from 'react';
import useCachedData from '../hooks/useCachedData';
import { fetchListings } from '../services/listings';
import { CACHE_TTL } from '../services/cacheService';

const ListingStatsContext = createContext({ total: 0, byType: {}, loading: false, error: null, refresh: () => {} });

export function ListingStatsProvider({ children }) {
  const { data: listings, loading, error, refresh } = useCachedData(
    fetchListings,
    'listings',
    [],
    { ttl: CACHE_TTL.listings, fallback: {} },
  );

  const { total, byType } = useMemo(() => {
    const nextByType = {};
    let count = 0;
    for (const [type, arr] of Object.entries(listings || {})) {
      const n = Array.isArray(arr) ? arr.length : 0;
      if (n > 0) nextByType[type] = n;
      count += n;
    }
    return { total: count, byType: nextByType };
  }, [listings]);

  return (
    <ListingStatsContext.Provider value={{ total, byType, loading, error, refresh }}>
      {children}
    </ListingStatsContext.Provider>
  );
}

export function useListingStats() {
  return useContext(ListingStatsContext);
}
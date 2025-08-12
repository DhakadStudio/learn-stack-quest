import { useState, useEffect, useCallback } from 'react';
import { Preferences } from '@capacitor/preferences';
import { supabase } from '@/integrations/supabase/client';

interface CacheData<T> {
  data: T;
  timestamp: number;
  version: string;
}

export const useLocalData = <T>(
  key: string,
  fetchFunction: () => Promise<T>,
  cacheTimeMs: number = 5 * 60 * 1000 // 5 minutes default
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCachedData = useCallback(async (): Promise<T | null> => {
    try {
      const { value } = await Preferences.get({ key });
      if (value) {
        const cachedData: CacheData<T> = JSON.parse(value);
        const isExpired = Date.now() - cachedData.timestamp > cacheTimeMs;
        if (!isExpired) {
          return cachedData.data;
        }
      }
    } catch (error) {
      console.error('Error reading cached data:', error);
    }
    return null;
  }, [key, cacheTimeMs]);

  const setCachedData = useCallback(async (newData: T) => {
    try {
      const cacheData: CacheData<T> = {
        data: newData,
        timestamp: Date.now(),
        version: '1.0.0'
      };
      await Preferences.set({ key, value: JSON.stringify(cacheData) });
    } catch (error) {
      console.error('Error setting cached data:', error);
    }
  }, [key]);

  const fetchData = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);

      // Try to get cached data first
      if (useCache) {
        const cachedData = await getCachedData();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
          // Continue to fetch fresh data in background
        }
      }

      // Fetch fresh data
      const freshData = await fetchFunction();
      setData(freshData);
      await setCachedData(freshData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      
      // If fetch failed, try to use cached data as fallback
      if (useCache) {
        const cachedData = await getCachedData();
        if (cachedData) {
          setData(cachedData);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, getCachedData, setCachedData]);

  const refreshData = useCallback(() => {
    return fetchData(false);
  }, [fetchData]);

  const clearCache = useCallback(async () => {
    try {
      await Preferences.remove({ key });
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [key]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refreshData,
    clearCache,
    fetchData
  };
};
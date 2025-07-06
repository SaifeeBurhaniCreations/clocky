import { useState, useEffect } from 'react';
import { useNotifications } from '../contexts/NotificationContext';

interface CachedTimeData {
  location: string;
  timeZone: string;
  lastUpdated: number;
  cachedTime: Date;
}

interface CachedSearchData {
  searchTerm: string;
  results: any[];
  timestamp: number;
}

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedTimes, setCachedTimes] = useState<CachedTimeData[]>([]);
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      addNotification({
        title: 'Back Online',
        description: 'Internet connection restored. Data will be updated.',
        type: 'success',
        icon: '📶'
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        title: 'Offline Mode',
        description: 'No internet connection. Showing cached data.',
        type: 'warning',
        icon: '📱'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initialize IndexedDB and load cached data
    initializeDB();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  const initializeDB = async () => {
    try {
      // Load from localStorage as fallback
      const cached = localStorage.getItem('cachedTimes');
      if (cached) {
        setCachedTimes(JSON.parse(cached));
      }

      // Try to use IndexedDB for better storage
      if ('indexedDB' in window) {
        const request = indexedDB.open('WorldTimeDB', 1);
        
        request.onerror = () => {
          console.log('IndexedDB not available, using localStorage');
        };
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          loadCachedData(db);
        };
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Create object stores
          if (!db.objectStoreNames.contains('times')) {
            db.createObjectStore('times', { keyPath: 'location' });
          }
          if (!db.objectStoreNames.contains('searches')) {
            db.createObjectStore('searches', { keyPath: 'searchTerm' });
          }
        };
      }
    } catch (error) {
      console.error('Error initializing offline storage:', error);
    }
  };

  const loadCachedData = (db: IDBDatabase) => {
    try {
      const transaction = db.transaction(['times'], 'readonly');
      const objectStore = transaction.objectStore('times');
      const request = objectStore.getAll();
      
      request.onsuccess = () => {
        setCachedTimes(request.result);
      };
    } catch (error) {
      console.error('Error loading cached data:', error);
    }
  };

  const cacheTimes = async (locations: Array<{name: string; timeZone: string}>) => {
    const now = Date.now();
    const cached: CachedTimeData[] = locations.map(location => ({
      location: location.name,
      timeZone: location.timeZone,
      lastUpdated: now,
      cachedTime: new Date()
    }));
    
    setCachedTimes(cached);
    
    // Store in localStorage as fallback
    localStorage.setItem('cachedTimes', JSON.stringify(cached));
    
    // Store in IndexedDB if available
    try {
      if ('indexedDB' in window) {
        const request = indexedDB.open('WorldTimeDB', 1);
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['times'], 'readwrite');
          const objectStore = transaction.objectStore('times');
          
          cached.forEach(item => {
            objectStore.put(item);
          });
        };
      }
    } catch (error) {
      console.error('Error caching to IndexedDB:', error);
    }
  };

  const getCachedTime = (locationName: string) => {
    const cached = cachedTimes.find(item => item.location === locationName);
    if (cached) {
      // Calculate estimated current time based on cached time
      const timeDiff = Date.now() - cached.lastUpdated;
      return new Date(cached.cachedTime.getTime() + timeDiff);
    }
    return new Date();
  };

  const cacheSearchResults = async (searchTerm: string, results: any[]) => {
    const cacheData: CachedSearchData = {
      searchTerm,
      results,
      timestamp: Date.now()
    };

    try {
      localStorage.setItem(`search_${searchTerm}`, JSON.stringify(cacheData));
      
      if ('indexedDB' in window) {
        const request = indexedDB.open('WorldTimeDB', 1);
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          const transaction = db.transaction(['searches'], 'readwrite');
          const objectStore = transaction.objectStore('searches');
          objectStore.put(cacheData);
        };
      }
    } catch (error) {
      console.error('Error caching search results:', error);
    }
  };

  const getCachedSearchResults = (searchTerm: string): any[] | null => {
    try {
      const cached = localStorage.getItem(`search_${searchTerm}`);
      if (cached) {
        const data: CachedSearchData = JSON.parse(cached);
        // Return cached results if less than 1 hour old
        if (Date.now() - data.timestamp < 3600000) {
          return data.results;
        }
      }
    } catch (error) {
      console.error('Error retrieving cached search results:', error);
    }
    return null;
  };

  return {
    isOnline,
    cacheTimes,
    getCachedTime,
    cachedTimes,
    cacheSearchResults,
    getCachedSearchResults
  };
};

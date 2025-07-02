
import { useState, useEffect } from 'react';

interface CachedTimeData {
  location: string;
  timeZone: string;
  lastUpdated: number;
  cachedTime: Date;
}

export const useOfflineSupport = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [cachedTimes, setCachedTimes] = useState<CachedTimeData[]>([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load cached times from localStorage
    const cached = localStorage.getItem('cachedTimes');
    if (cached) {
      setCachedTimes(JSON.parse(cached));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheTimes = (locations: Array<{name: string; timeZone: string}>) => {
    const now = Date.now();
    const cached: CachedTimeData[] = locations.map(location => ({
      location: location.name,
      timeZone: location.timeZone,
      lastUpdated: now,
      cachedTime: new Date()
    }));
    
    setCachedTimes(cached);
    localStorage.setItem('cachedTimes', JSON.stringify(cached));
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

  return {
    isOnline,
    cacheTimes,
    getCachedTime,
    cachedTimes
  };
};

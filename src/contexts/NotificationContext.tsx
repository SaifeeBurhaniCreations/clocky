
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
  read: boolean;
  type?: 'info' | 'warning' | 'success' | 'error';
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
  simulateNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

const STORAGE_KEY = 'world-time-notifications';
const BROADCAST_CHANNEL_NAME = 'notifications-sync';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [broadcastChannel, setBroadcastChannel] = useState<BroadcastChannel | null>(null);

  // Load notifications from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedNotifications = JSON.parse(stored).map((notif: any) => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(parsedNotifications);
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error);
    }
  }, []);

  // Initialize BroadcastChannel for cross-tab sync
  useEffect(() => {
    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      setBroadcastChannel(channel);

      channel.onmessage = (event) => {
        const { type, data } = event.data;
        
        switch (type) {
          case 'NOTIFICATION_ADDED':
            setNotifications(prev => {
              const exists = prev.find(n => n.id === data.id);
              if (exists) return prev;
              return [data, ...prev];
            });
            break;
          case 'NOTIFICATION_READ':
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === data.id ? { ...notif, read: true } : notif
              )
            );
            break;
          case 'NOTIFICATION_DISMISSED':
            setNotifications(prev => prev.filter(notif => notif.id !== data.id));
            break;
          case 'ALL_READ':
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            break;
          case 'ALL_CLEARED':
            setNotifications([]);
            break;
        }
      };

      return () => {
        channel.close();
      };
    } else {
      // Fallback to storage event for cross-tab sync
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const parsedNotifications = JSON.parse(e.newValue).map((notif: any) => ({
              ...notif,
              timestamp: new Date(notif.timestamp)
            }));
            setNotifications(parsedNotifications);
          } catch (error) {
            console.error('Error parsing notifications from storage event:', error);
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  }, [notifications]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }, []);

  // Request permission on first load
  useEffect(() => {
    requestNotificationPermission();
  }, [requestNotificationPermission]);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Send browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      const browserNotification = new Notification(notification.title, {
        body: notification.description,
        icon: notification.icon || '/placeholder.svg',
        badge: '/placeholder.svg',
        tag: newNotification.id,
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        browserNotification.close();
      }, 5000);
    }

    // Broadcast to other tabs
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NOTIFICATION_ADDED',
        data: newNotification
      });
    }
  }, [broadcastChannel]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );

    // Broadcast to other tabs
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NOTIFICATION_READ',
        data: { id }
      });
    }
  }, [broadcastChannel]);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));

    // Broadcast to other tabs
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'ALL_READ',
        data: {}
      });
    }
  }, [broadcastChannel]);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));

    // Broadcast to other tabs
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NOTIFICATION_DISMISSED',
        data: { id }
      });
    }
  }, [broadcastChannel]);

  const clearAll = useCallback(() => {
    setNotifications([]);

    // Broadcast to other tabs
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'ALL_CLEARED',
        data: {}
      });
    }
  }, [broadcastChannel]);

  const simulateNotification = useCallback(() => {
    const sampleNotifications = [
      {
        title: 'Weather Alert',
        description: 'Heavy rain expected in Mumbai at 5 PM',
        type: 'warning' as const,
        icon: '🌧️'
      },
      {
        title: 'Time Zone Added',
        description: 'Successfully added Tokyo to your time zones',
        type: 'success' as const,
        icon: '🕒'
      },
      {
        title: 'Meeting Reminder',
        description: 'Your meeting starts in 15 minutes (New York time)',
        type: 'info' as const,
        icon: '📅'
      },
      {
        title: 'System Update',
        description: 'World Time Windows has been updated with new features',
        type: 'info' as const,
        icon: '🔄'
      },
      {
        title: 'Offline Mode',
        description: 'You are now offline. Showing cached data.',
        type: 'error' as const,
        icon: '📱'
      }
    ];

    const randomNotification = sampleNotifications[Math.floor(Math.random() * sampleNotifications.length)];
    addNotification(randomNotification);
  }, [addNotification]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      dismissNotification,
      clearAll,
      simulateNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

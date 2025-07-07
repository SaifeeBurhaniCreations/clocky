import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Bell, Plus, Trash, Clock } from 'lucide-react';
import { getCurrentTimeString, getTimeInZone } from '../utils/timeUtils';

interface NotificationRule {
  id: string;
  location: string;
  timeZone: string;
  targetTime: string;
  message: string;
  enabled: boolean;
}

interface NotificationManagerProps {
  locations: Array<{ name: string; timeZone: string; customName?: string }>;
  isDarkMode: boolean;
}

const NotificationManager: React.FC<NotificationManagerProps> = ({
  locations,
  isDarkMode,
}) => {
  const [notifications, setNotifications] = useState<NotificationRule[]>([]);
  const [isAddingNotification, setIsAddingNotification] = useState(false);

  
  const [newNotification, setNewNotification] = useState({
    location: '',
    targetTime: getCurrentTimeString(),
    message: 'Time reminder',
  });
  
  
  // Request permission & load saved notifications
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const saved = localStorage.getItem('timeNotifications');
    if (saved) setNotifications(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('timeNotifications', JSON.stringify(notifications));
  }, [notifications]);

  // Notification checker
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      notifications.forEach((notification) => {
        if (!notification.enabled) return;

        const currentTime = getTimeInZone(now, notification.timeZone, true); // "HH:MM"
        const [curHour, curMinute] = currentTime.split(':').map(Number);
        const [targetHour, targetMinute] = notification.targetTime.split(':').map(Number);

        const isMatch = curHour === targetHour && curMinute === targetMinute;
        const key = `notified-${notification.id}-${now.toDateString()}-${notification.targetTime}`;

        if (isMatch && !localStorage.getItem(key)) {
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`⏰ ${notification.location}`, {
              body: notification.message,
              icon: '/icon.png', // Optional icon path
            });
            localStorage.setItem(key, 'true');
          }
        }
      });
    }, 15000); // Check every 15s

    return () => clearInterval(interval);
  }, [notifications]);

  const addNotification = () => {
    if (!newNotification.location) return;

    const location = locations.find((loc) => loc.name === newNotification.location);
    if (!location) return;

    const notification: NotificationRule = {
      id: Date.now().toString(),
      location: location.customName || location.name,
      timeZone: location.timeZone,
      targetTime: newNotification.targetTime,
      message: newNotification.message,
      enabled: true,
    };

    setNotifications([...notifications, notification]);
    setNewNotification({ location: '', targetTime: getCurrentTimeString(), message: 'Time reminder' });
    setIsAddingNotification(false);
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Card className={`p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="text-lg font-semibold">Time Notifications</h3>
        </div>
        <Button
  variant="outline"
  size="sm"
  onClick={() => {
    const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const match = locations.find((loc) => loc.timeZone === systemTimeZone);
    console.log(systemTimeZone);
    console.log(locations);
    
    setNewNotification({
      location: match?.name || '',
      targetTime: getCurrentTimeString(),
      message: 'Time reminder',
    });
    setIsAddingNotification(true);
  }}
>
  <Plus className="h-4 w-4 mr-1" />
  Add
</Button>
      </div>

      {isAddingNotification && (
        <div
          className={`p-4 mb-4 rounded-lg border ${
            isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <select
              value={newNotification.location}
              onChange={(e) => setNewNotification({ ...newNotification, location: e.target.value })}
              className={`px-3 py-2 rounded border ${
                isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="">Select City</option>
              {locations.map((location) => (
                <option key={location.name} value={location.name}>
                  {location.customName || location.name}
                </option>
              ))}
            </select>

            <input
              type="time"
              value={newNotification.targetTime}
              onChange={(e) => setNewNotification({ ...newNotification, targetTime: e.target.value })}
              className={`px-3 py-2 rounded border ${
                isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
              }`}
            />

            <input
              type="text"
              placeholder="Notification message"
              value={newNotification.message}
              onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
              className={`px-3 py-2 rounded border ${
                isDarkMode ? 'bg-gray-600 border-gray-500 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={addNotification}>
              Add Notification
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setIsAddingNotification(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4" />
              <div>
                <div className="font-medium">{notification.location}</div>
                <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notification.targetTime} – {notification.message}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleNotification(notification.id)}
                className={notification.enabled ? 'text-green-600' : 'text-gray-400'}
              >
                <Bell className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNotification(notification.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No notifications set up yet. Add one to get time reminders!
          </div>
        )}
      </div>
    </Card>
  );
};

export default NotificationManager;
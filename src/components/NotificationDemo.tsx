
import React from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationDemo: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
  const { simulateNotification, addNotification } = useNotifications();

  const sendCustomNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    const notifications = {
      info: {
        title: 'Information',
        description: 'This is an informational message',
        type: 'info' as const,
        icon: 'ℹ️'
      },
      success: {
        title: 'Success!',
        description: 'Operation completed successfully',
        type: 'success' as const,
        icon: '✅'
      },
      warning: {
        title: 'Warning',
        description: 'Please pay attention to this warning',
        type: 'warning' as const,
        icon: '⚠️'
      },
      error: {
        title: 'Error',
        description: 'Something went wrong, please try again',
        type: 'error' as const,
        icon: '❌'
      }
    };

    addNotification(notifications[type]);
  };

  return (
    <Card className={`p-6 mb-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h3 className="text-lg font-semibold mb-4">Notification System Demo</h3>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        Test the notification system with different types of notifications. They will appear in the bell icon above and as browser notifications (if permitted).
      </p>
      
      <div className="flex flex-wrap gap-2">
        <Button onClick={simulateNotification} className="bg-blue-500 hover:bg-blue-600">
          Random Notification
        </Button>
        <Button onClick={() => sendCustomNotification('info')} variant="outline">
          Info
        </Button>
        <Button onClick={() => sendCustomNotification('success')} variant="outline">
          Success
        </Button>
        <Button onClick={() => sendCustomNotification('warning')} variant="outline">
          Warning
        </Button>
        <Button onClick={() => sendCustomNotification('error')} variant="outline">
          Error
        </Button>
      </div>

      <div className={`mt-4 p-3 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
        <p className="text-xs font-medium mb-1">Features:</p>
        <ul className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <li>• Notifications persist across browser sessions</li>
          <li>• Real-time sync across browser tabs</li>
          <li>• Browser notifications (with permission)</li>
          <li>• Grouped by time (Today, Yesterday, Older)</li>
          <li>• Mark as read/unread functionality</li>
        </ul>
      </div>
    </Card>
  );
};

export default NotificationDemo;

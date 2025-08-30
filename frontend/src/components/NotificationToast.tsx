import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useNotificationStore, Notification } from '../stores/notificationStore';

const NotificationToast: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  const getBorderColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200';
      case 'error':
        return 'border-red-200';
      case 'warning':
        return 'border-yellow-200';
      case 'info':
        return 'border-blue-200';
      default:
        return 'border-blue-200';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getBgColor(notification.type)} border ${getBorderColor(notification.type)} rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}
        >
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              {getIcon(notification.type)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-medium ${getTextColor(notification.type)}`}>
                {notification.title}
              </div>
              <div className={`text-sm ${getTextColor(notification.type)} opacity-80 mt-1`}>
                {notification.message}
              </div>
              
              {/* Action Button */}
              {notification.action && (
                <button
                  onClick={notification.action.onClick}
                  className={`mt-2 text-sm font-medium ${getTextColor(notification.type)} hover:opacity-80 transition-opacity`}
                >
                  {notification.action.label}
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className={`flex-shrink-0 p-1 rounded-full ${getTextColor(notification.type)} hover:bg-white/50 transition-colors`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar (if duration is set) */}
          {notification.duration && notification.duration > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-100 ${
                    notification.type === 'success' ? 'bg-green-500' :
                    notification.type === 'error' ? 'bg-red-500' :
                    notification.type === 'warning' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`}
                  style={{
                    width: '100%',
                    animation: `shrink ${notification.duration}ms linear forwards`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;

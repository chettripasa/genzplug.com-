import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Notification } from '../types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

// Action types
type NotificationAction =
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

// State interface
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'SET_NOTIFICATIONS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.isRead).length,
        isLoading: false,
        error: null,
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + (action.payload.isRead ? 0 : 1),
      };
    
    case 'MARK_AS_READ': {
      const updatedNotifications = state.notifications.map(notification =>
        notification._id === action.payload
          ? { ...notification, isRead: true }
          : notification
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.isRead).length,
      };
    }
    
    case 'MARK_ALL_AS_READ': {
      const updatedNotifications = state.notifications.map(notification => ({
        ...notification,
        isRead: true,
      }));
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: 0,
      };
    }
    
    case 'REMOVE_NOTIFICATION': {
      const removedNotification = state.notifications.find(n => n._id === action.payload);
      const updatedNotifications = state.notifications.filter(n => n._id !== action.payload);
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: state.unreadCount - (removedNotification?.isRead ? 0 : 1),
      };
    }
    
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload || null,
        isLoading: false,
      };
    
    default:
      return state;
  }
};

// Context interface
interface NotificationContextType extends NotificationState {
  fetchNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (notificationId: string) => void;
  addNotification: (notification: Notification) => void;
  clearError: () => void;
}

// Create context
const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { isAuthenticated } = useAuth();

  // Fetch notifications on mount and when authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      // For now, we'll just set loading to false since we don't have the API
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [isAuthenticated]);

  // Fetch notifications from API - placeholder for now
  const fetchNotifications = async (): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      // TODO: Implement when notifications API is ready
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch notifications';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      toast.error(errorMessage);
    }
  };

  // Mark notification as read - placeholder for now
  const markAsRead = async (notificationId: string): Promise<void> => {
    try {
      // TODO: Implement when notifications API is ready
      dispatch({ type: 'MARK_AS_READ', payload: notificationId });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark notification as read';
      toast.error(errorMessage);
    }
  };

  // Mark all notifications as read - placeholder for now
  const markAllAsRead = async (): Promise<void> => {
    try {
      // TODO: Implement when notifications API is ready
      dispatch({ type: 'MARK_ALL_AS_READ' });
      toast.success('All notifications marked as read');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to mark all notifications as read';
      toast.error(errorMessage);
    }
  };

  // Remove notification locally
  const removeNotification = (notificationId: string): void => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: notificationId });
  };

  // Add notification locally (for real-time updates)
  const addNotification = (notification: Notification): void => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: notification });
    
    // Show toast for new notifications
    if (!notification.isRead) {
      toast(notification.message, {
        icon: getNotificationIcon(notification.type),
        duration: 5000,
      });
    }
  };

  // Clear error
  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📢';
    }
  };

  const value: NotificationContextType = {
    ...state,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    addNotification,
    clearError,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

// Custom hook to use notification context
export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;

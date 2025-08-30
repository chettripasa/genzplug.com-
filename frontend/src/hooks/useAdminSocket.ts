import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

interface DashboardStats {
  totalUsers: number;
  totalVideos: number;
  totalOrders: number;
  processingVideos: number;
  pendingOrders: number;
  onlineUsers: number;
  timestamp: string;
}

interface VideoStatus {
  videoId: string;
  status: string;
  progress: number;
  error: string | null;
}

interface SystemEvent {
  type: string;
  data: any;
  timestamp: string;
}

export const useAdminSocket = () => {
  const { user, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [videoStatuses, setVideoStatuses] = useState<Map<string, VideoStatus>>(new Map());
  const [systemEvents, setSystemEvents] = useState<SystemEvent[]>([]);

  useEffect(() => {
    if (user && token && user.role === 'admin') {
      // Connect to admin namespace
      socketRef.current = io(`${import.meta.env.VITE_API_URL}/admin`, {
        auth: {
          token: token
        }
      });

      socketRef.current.on('connect', () => {
        console.log('Admin connected to server');
        setIsConnected(true);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Admin disconnected from server');
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Admin socket connection error:', error);
        setIsConnected(false);
      });

      // Handle dashboard stats
      socketRef.current.on('dashboard-stats', (stats: DashboardStats) => {
        setDashboardStats(stats);
      });

      // Handle video status updates
      socketRef.current.on('video-status-update', (status: VideoStatus) => {
        setVideoStatuses(prev => new Map(prev).set(status.videoId, status));
      });

      // Handle system events
      socketRef.current.on('user-banned', (data) => {
        const event: SystemEvent = {
          type: 'user-banned',
          data,
          timestamp: new Date().toISOString()
        };
        setSystemEvents(prev => [event, ...prev.slice(0, 99)]); // Keep last 100 events
      });

      socketRef.current.on('content-moderated', (data) => {
        const event: SystemEvent = {
          type: 'content-moderated',
          data,
          timestamp: new Date().toISOString()
        };
        setSystemEvents(prev => [event, ...prev.slice(0, 99)]);
      });

      // Handle admin action responses
      socketRef.current.on('ban-success', (data) => {
        console.log('User banned successfully:', data);
      });

      socketRef.current.on('ban-error', (data) => {
        console.error('Failed to ban user:', data);
      });

      socketRef.current.on('moderation-success', (data) => {
        console.log('Content moderated successfully:', data);
      });

      socketRef.current.on('moderation-error', (data) => {
        console.error('Failed to moderate content:', data);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, token]);

  // Admin actions
  const getDashboardStats = () => {
    if (socketRef.current) {
      socketRef.current.emit('get-dashboard-stats');
    }
  };

  const getVideoStatus = (videoId: string) => {
    if (socketRef.current) {
      socketRef.current.emit('get-video-status', videoId);
    }
  };

  const subscribeToSystemEvents = () => {
    if (socketRef.current) {
      socketRef.current.emit('subscribe-system-events');
    }
  };

  const unsubscribeFromSystemEvents = () => {
    if (socketRef.current) {
      socketRef.current.emit('unsubscribe-system-events');
    }
  };

  const banUser = (userId: string, reason: string) => {
    if (socketRef.current) {
      socketRef.current.emit('ban-user', userId, reason);
    }
  };

  const moderateContent = (contentId: string, contentType: string, action: 'approve' | 'reject' | 'flag') => {
    if (socketRef.current) {
      socketRef.current.emit('moderate-content', contentId, contentType, action);
    }
  };

  // Auto-refresh dashboard stats every 30 seconds
  useEffect(() => {
    if (isConnected) {
      getDashboardStats();
      const interval = setInterval(getDashboardStats, 30000);
      return () => clearInterval(interval);
    }
  }, [isConnected]);

  return {
    socket: socketRef.current,
    isConnected,
    dashboardStats,
    videoStatuses,
    systemEvents,
    getDashboardStats,
    getVideoStatus,
    subscribeToSystemEvents,
    unsubscribeFromSystemEvents,
    banUser,
    moderateContent
  };
};

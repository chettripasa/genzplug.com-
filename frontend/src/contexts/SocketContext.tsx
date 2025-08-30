import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNotificationStore } from '../stores/notificationStore';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (roomId: string, message: string) => void;
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  emitEvent: (event: string, data: any) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!user) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Initialize socket connection
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token'),
      },
      transports: ['websocket', 'polling'],
    });

    // Connection events
    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Socket connected:', newSocket.id);
      
      // Join user's personal room
      newSocket.emit('join-personal-room', { userId: user._id });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      addNotification({
        type: 'error',
        title: 'Connection Error',
        message: 'Failed to connect to real-time services',
        duration: 5000,
      });
    });

    // Real-time notifications
    newSocket.on('notification', (data) => {
      addNotification({
        type: data.type || 'info',
        title: data.title,
        message: data.message,
        duration: data.duration || 5000,
      });
    });

    // Chat messages
    newSocket.on('chat-message', (data) => {
      // Handle incoming chat messages
      console.log('New chat message:', data);
    });

    // Live updates
    newSocket.on('live-update', (data) => {
      // Handle live updates (likes, comments, etc.)
      console.log('Live update:', data);
    });

    // Video streaming events
    newSocket.on('stream-started', (data) => {
      addNotification({
        type: 'info',
        title: 'Live Stream Started',
        message: `${data.username} is now live!`,
        duration: 8000,
        action: {
          label: 'Watch Now',
          onClick: () => window.location.href = `/videos/live/${data.streamId}`,
        },
      });
    });

    // Gaming events
    newSocket.on('game-invite', (data) => {
      addNotification({
        type: 'info',
        title: 'Game Invitation',
        message: `${data.username} invited you to play ${data.gameName}`,
        duration: 10000,
        action: {
          label: 'Accept',
          onClick: () => {
            newSocket.emit('accept-game-invite', { inviteId: data.inviteId });
          },
        },
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, addNotification]);

  const sendMessage = (roomId: string, message: string) => {
    if (socket && isConnected) {
      socket.emit('send-message', { roomId, message });
    }
  };

  const joinRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('join-room', { roomId });
    }
  };

  const leaveRoom = (roomId: string) => {
    if (socket && isConnected) {
      socket.emit('leave-room', { roomId });
    }
  };

  const emitEvent = (event: string, data: any) => {
    if (socket && isConnected) {
      socket.emit(event, data);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    sendMessage,
    joinRoom,
    leaveRoom,
    emitEvent,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';

export const useSocket = (): Socket | null => {
  const { user, token } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (user && token) {
      // Connect to Socket.IO server with authentication
      socketRef.current = io(import.meta.env.VITE_API_URL, {
        auth: {
          token: token
        }
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to server');
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user, token]);

  return socketRef.current;
};

export const useChatSocket = (conversationId?: string) => {
  const socket = useSocket();

  const joinConversation = (convId: string) => {
    if (socket) {
      socket.emit('join-conversation', convId);
    }
  };

  const leaveConversation = (convId: string) => {
    if (socket) {
      socket.emit('leave-conversation', convId);
    }
  };

  const sendMessage = (text: string, recipientId: string, convId: string) => {
    if (socket) {
      socket.emit('send-message', {
        conversationId: convId,
        text,
        recipientId
      });
    }
  };

  const startTyping = (convId: string) => {
    if (socket) {
      socket.emit('typing-start', { conversationId: convId });
    }
  };

  const stopTyping = (convId: string) => {
    if (socket) {
      socket.emit('typing-stop', { conversationId: convId });
    }
  };

  useEffect(() => {
    if (conversationId && socket) {
      joinConversation(conversationId);
      
      return () => {
        leaveConversation(conversationId);
      };
    }
  }, [conversationId, socket]);

  return {
    socket,
    sendMessage,
    startTyping,
    stopTyping
  };
};

// Hook for video processing progress
export const useVideoProcessing = (videoId?: string) => {
  const socket = useSocket();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('');
  const [status, setStatus] = useState<'processing' | 'completed' | 'failed'>('processing');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !videoId) return;

    // Join video processing room
    socket.emit('join-room', `video_${videoId}`);

    // Listen for progress updates
    const handleProgress = (data: { videoId: string; progress: number; stage: string }) => {
      if (data.videoId === videoId) {
        setProgress(data.progress);
        setStage(data.stage);
      }
    };

    // Listen for completion
    const handleComplete = (data: { videoId: string; status: string; videoUrl: string; thumbnailUrl: string; duration: number }) => {
      if (data.videoId === videoId) {
        setStatus('completed');
        setProgress(100);
        setStage('Video processing completed!');
      }
    };

    // Listen for errors
    const handleError = (data: { videoId: string; status: string; error: string }) => {
      if (data.videoId === videoId) {
        setStatus('failed');
        setError(data.error);
        setStage('Processing failed');
      }
    };

    socket.on('video-progress', handleProgress);
    socket.on('video-complete', handleComplete);
    socket.on('video-error', handleError);

    return () => {
      socket.off('video-progress', handleProgress);
      socket.off('video-complete', handleComplete);
      socket.off('video-error', handleError);
      socket.emit('leave-room', `video_${videoId}`);
    };
  }, [socket, videoId]);

  return {
    progress,
    stage,
    status,
    error,
    isProcessing: status === 'processing',
    isCompleted: status === 'completed',
    isFailed: status === 'failed'
  };
};

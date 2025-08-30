import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import Message from '../models/Message';

// Store online users
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const setupChatSocket = (io: SocketIOServer) => {
  // Chat namespace
  const chatNamespace = io.of('/chat');
  
  // Authentication middleware
  chatNamespace.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string) as any;
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  chatNamespace.on('connection', (socket) => {
    const userId = socket.data.user.userId;
    console.log('💬 User connected to chat:', userId);
    
    // Add user to online users
    onlineUsers.set(userId, socket.id);
    
    // Emit user online event
    socket.broadcast.emit('user-online', { userId });
    
    // Join user's personal room
    socket.join(`user-${userId}`);
    
    // Handle joining conversations
    socket.on('join-conversation', (conversationId) => {
      socket.join(`conversation-${conversationId}`);
      console.log(`User ${userId} joined conversation: ${conversationId}`);
    });
    
    // Handle leaving conversations
    socket.on('leave-conversation', (conversationId) => {
      socket.leave(`conversation-${conversationId}`);
      console.log(`User ${userId} left conversation: ${conversationId}`);
    });
    
    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { recipientId, text, conversationId } = data;
        
        // Save message to database
        const message = new Message({
          sender: userId,
          recipient: recipientId,
          text,
          conversationId
        });
        
        await message.save();
        
        // Emit to conversation room
        chatNamespace.to(`conversation-${conversationId}`).emit('new-message', {
          message: {
            _id: message._id,
            sender: userId,
            recipient: recipientId,
            text,
            conversationId,
            createdAt: message.createdAt
          }
        });
        
        // Notify recipient if they're not in the conversation
        const recipientSocketId = onlineUsers.get(recipientId);
        if (recipientSocketId && recipientSocketId !== socket.id) {
          chatNamespace.to(recipientSocketId).emit('message-notification', {
            sender: userId,
            text: text.substring(0, 50) + (text.length > 50 ? '...' : ''),
            conversationId
          });
        }
        
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });
    
    // Handle typing indicators
    socket.on('typing-start', (conversationId) => {
      socket.to(`conversation-${conversationId}`).emit('user-typing', {
        userId,
        conversationId,
        isTyping: true
      });
    });
    
    socket.on('typing-stop', (conversationId) => {
      socket.to(`conversation-${conversationId}`).emit('user-typing', {
        userId,
        conversationId,
        isTyping: false
      });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('💬 User disconnected from chat:', userId);
      
      // Remove from online users
      onlineUsers.delete(userId);
      
      // Emit user offline event
      socket.broadcast.emit('user-offline', { userId });
    });
  });
};

// Export helper functions
export const getOnlineUsers = () => Array.from(onlineUsers.keys());
export const isUserOnline = (userId: string) => onlineUsers.has(userId);
export const getUserSocketId = (userId: string) => onlineUsers.get(userId);

import { Server as SocketIOServer } from 'socket.io';
import jwt from 'jsonwebtoken';

export const setupAdminSocket = (io: SocketIOServer) => {
  // Admin namespace for administrative functions
  const adminNamespace = io.of('/admin');
  
  // Admin authentication middleware
  adminNamespace.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env['JWT_SECRET'] as string) as any;
      if (decoded.role !== 'admin') {
        return next(new Error('Admin access required'));
      }
      
      socket.data.user = decoded;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  adminNamespace.on('connection', (socket) => {
    console.log('👑 Admin connected:', socket.id);
    
    // Join admin room
    socket.join('admin-room');
    
    // Handle admin-specific events
    socket.on('admin-broadcast', (message) => {
      adminNamespace.emit('admin-message', {
        message,
        from: socket.data.user.username,
        timestamp: new Date().toISOString()
      });
    });
    
    socket.on('disconnect', () => {
      console.log('👑 Admin disconnected:', socket.id);
    });
  });
};

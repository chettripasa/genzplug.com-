import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ message: 'Access denied. No token provided.' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    
    if (!decoded.userId) {
      res.status(401).json({ message: 'Invalid token format.' });
      return;
    }

    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Legacy auth function for backward compatibility
export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  return authenticateToken(req, res, next);
};

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await authenticateToken(req, res, () => {});
    
    if (req.user.role !== 'admin') {
      res.status(403).json({ message: 'Access denied. Admin privileges required.' });
      return;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

export const moderatorAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await auth(req, res, () => {});
    
    if (!['admin', 'moderator'].includes(req.user.role)) {
      res.status(403).json({ message: 'Access denied. Moderator privileges required.' });
      return;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

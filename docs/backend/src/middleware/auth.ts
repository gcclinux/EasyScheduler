import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthRequest extends Request {
  admin?: {
    aid: number;
    login: string;
    role?: 'admin' | 'readonly';
  };
}

export const authenticateAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { aid: number; login: string; role?: 'admin' | 'readonly' };
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }
};

export const generateToken = (aid: number, login: string, role: 'admin' | 'readonly' = 'admin'): string => {
  return jwt.sign({ aid, login, role }, JWT_SECRET, { expiresIn: '24h' });
};

export const requireWriteAccess = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.admin?.role === 'readonly') {
    return res.status(403).json({
      success: false,
      error: 'Read-only access: modification not allowed'
    });
  }
  next();
};

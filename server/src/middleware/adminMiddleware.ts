import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'Admin' || req.user.role === 'Project Head')) {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin or project head' });
  }
};

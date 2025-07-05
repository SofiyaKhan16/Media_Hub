import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.js';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError('No token provided', 401));
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(new AppError('Invalid or expired token', 401));
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 401));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Authentication error: ' + error.message, 500));
  }
};

export default authMiddleware;

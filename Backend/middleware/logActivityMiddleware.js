import { logActivity } from '../utils/logger.js';

export const logActivityMiddleware = (action) => {
  return (req, res, next) => {
    const userId = req.userId || req.ip || 'GUEST';
    logActivity(userId.toString(), action, new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    next();
  };
};

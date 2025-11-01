import rateLimit from 'express-rate-limit';

// Rate limit cho login - giới hạn số lần đăng nhập trong 15 phút
export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

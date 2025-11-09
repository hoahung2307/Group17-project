import jwt from "jsonwebtoken";
import User from "../models/modelMain.m.js";

export const protectRoute = async (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;
  const token = bearerToken || req.cookies.jwt;
  console.log("Client kết nối Backend");

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Cookie JWT không tồn tại. Vui lòng đăng nhập.",
    });
  }

  try {
    const decoded = jwt.verify(token, "group17");
    
    // Kiểm tra người dùng có bị chặn không
    const user = await User.findById(decoded.userId);
    if (user && user.isBlocked && user.role === 'user') {
      return res.status(403).json({
        success: false,
        error: "Tài khoản của bạn đã bị chặn. Vui lòng liên hệ quản trị viên.",
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
    });
  }
};

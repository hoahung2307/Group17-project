import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt;
  console.log("Client kết nối Backend");

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Cookie JWT không tồn tại. Vui lòng đăng nhập.",
    });
  }

  try {
    const decoded = jwt.verify(token, "group17");

   
    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.",
    });
  }
};

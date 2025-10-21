export const protectRoute = async (req,res,next) => {
    const token = req.cookies.jwt;
  console.log("Client Kết Nói Backend");
    if (!token) {
      return res.status(UNAUTHORIZED).json({
        success:false,
        error:
          "Cookie JWT Không Tồn Tại Vui Lòng Đăng Nhập",
      });
    }

    const isCheckingCookie = jwt.verify(
      token,
      "group17"
    )

    if (!isCheckingCookie) {
      return res.status(400).json({
        error:
          "Sai Cookie Bảo Mật Vui Lòng Kiểm Tra Lại Hoặc F5 và Đăng Nhập Lại",
      });
      
    }
    req.userId = isCheckingCookie.userId;

    next();
 
};
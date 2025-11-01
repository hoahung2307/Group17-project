export const validateImageProfile = (req, res, next) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'Vui lòng upload ảnh'
    });
  }
  if (file.size > 1024 * 1024 * 5) {
    return res.status(400).json({
      success: false,
      message: 'Ảnh không được lớn hơn 5MB vui lòng upload lại'
    });
  }
  if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
    return res.status(400).json({
      success: false,
      message: 'Ảnh không được là ảnh png hoặc jpeg'
    });
  }
  next();
};

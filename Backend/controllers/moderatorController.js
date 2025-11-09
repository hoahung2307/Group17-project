import User from "../models/modelMain.m.js";
import { logActivity } from "../utils/logger.js";

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại"
      });
    }

    if (user.role === 'admin' || user.role === 'moderator') {
      return res.status(403).json({
        message: "Không thể chặn tài khoản admin hoặc moderator"
      });
    }

    user.isBlocked = true;
    await user.save();

    logActivity(req.userId, `BLOCK_USER_${id}_SUCCESS`, new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    
    return res.status(200).json({
      message: "Chặn người dùng thành công"
    });
  } catch (error) {
    logActivity(req.userId, "BLOCK_USER_FAILED", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    return res.status(500).json({
      message: "Lỗi khi chặn người dùng",
      error: error.message
    });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại"
      });
    }

    user.isBlocked = false;
    await user.save();

    logActivity(req.userId, `UNBLOCK_USER_${id}_SUCCESS`, new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    
    return res.status(200).json({
      message: "Mở chặn người dùng thành công"
    });
  } catch (error) {
    logActivity(req.userId, "UNBLOCK_USER_FAILED", new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }));
    return res.status(500).json({
      message: "Lỗi khi mở chặn người dùng",
      error: error.message
    });
  }
};
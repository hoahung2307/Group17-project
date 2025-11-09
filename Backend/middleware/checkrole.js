import User from "../models/modelMain.m.js";

export const checkRoleAdmin = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({
      message: "Người Dùng Không Tồn Tại"
    });
  }
  if (user.role !== "admin") {
    return res.status(403).json({
      message: "Bạn Không Có Quyền Truy Cập"
    });
  }
  next();
};

export const checkRoleModerator = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({
      message: "Người Dùng Không Tồn Tại"
    });
  }
  if (user.role !== "moderator") {
    return res.status(403).json({
      message: "Bạn Không Có Quyền Truy Cập"
    });
  }
  next();
};

export const checkRoleUser = async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({
      message: "Người Dùng Không Tồn Tại"
    });
  }
  if (user.role !== "user") {
    return res.status(403).json({
      message: "Bạn Không Có Quyền Truy Cập"
    });
  }
  next();
};

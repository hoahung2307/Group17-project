import fs from "fs";
import path from "path";

const logFilePath = path.join(process.cwd(), "../Backend/logs/admin-actions.log");

export const logAdminAction = (adminId, action, targetUser) => {
  const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
  const logMessage = `[${timestamp}] ADMIN: ${adminId} → ${action} → USER: ${targetUser}\n`;

  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Lỗi khi ghi log admin:", err);
    }
  });
};

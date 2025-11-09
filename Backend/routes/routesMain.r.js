import express from 'express';
const router = express.Router();

import {
  getUsers,
  postUsers,
  deleteUsers,
  updateUsers,
  Login,
  Register,
  logout,
  getMe,
  updateName,
  updatePassword,
  updateImageProfile,
  forgotPassword,
  refreshAccessToken,
  resetPassword,
  deleteAccountFromAdmin,
  deleteAccount
  ,getActivityLogs
} from '../controllers/controllerMain.c.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkRoleAdmin, checkRoleModerator, checkRoleUser } from '../middleware/checkrole.js';
import { validateImageProfile } from '../middleware/validation.js';
import { logActivityMiddleware } from '../middleware/logActivityMiddleware.js';
import { uploadCloudinary } from '../config/cloudinary.js';
import { loginRateLimit } from '../middleware/rateLimit.js';
import { blockUser, unblockUser } from '../controllers/moderatorController.js';

// User routes
router.post("/user", logActivityMiddleware('CREATE_USER'), postUsers);
router.delete("/user/:id", logActivityMiddleware('DELETE_USER'), deleteUsers);
router.put("/user/:id", logActivityMiddleware('UPDATE_USER'), updateUsers);
router.post("/user/deleteAccount", logActivityMiddleware('DELETE_ACCOUNT'), deleteAccount);
router.get("/user/profile", protectRoute, logActivityMiddleware('GET_PROFILE'), getMe);
router.put("/user/profile/avatar", protectRoute, uploadCloudinary.single('image'), validateImageProfile, logActivityMiddleware('UPDATE_AVATAR'), updateImageProfile);
router.put("/user/profile/name", protectRoute, logActivityMiddleware('UPDATE_NAME'), updateName);
router.put("/user/profile/password", protectRoute, logActivityMiddleware('UPDATE_PASSWORD'), updatePassword);

// Auth routes
router.post("/auth/login", loginRateLimit, logActivityMiddleware('LOGIN_ATTEMPT'), Login);
router.post("/auth/register", logActivityMiddleware('REGISTER'), Register);
router.post("/auth/logout", logActivityMiddleware('LOGOUT'), logout);
router.post("/auth/forgot-password", logActivityMiddleware('FORGOT_PASSWORD'), forgotPassword);
router.post("/auth/reset-password/:resetPasswordToken", logActivityMiddleware('RESET_PASSWORD'), resetPassword);
router.post("/auth/refresh", logActivityMiddleware('REFRESH_ACCESS_TOKEN'), refreshAccessToken);

// Admin routes
router.delete("/admin/users/:id", protectRoute, checkRoleAdmin, deleteAccountFromAdmin);
router.get("/admin/users", protectRoute, checkRoleAdmin, getUsers);
// Admin activity logs
router.get("/admin/logs", protectRoute, checkRoleAdmin, getActivityLogs);

// Moderator routes
router.patch("/users/:id/block", protectRoute, checkRoleModerator, blockUser);
router.patch("/users/:id/unblock", protectRoute, checkRoleModerator, unblockUser);
router.get("/moderator/users", protectRoute, checkRoleModerator, getUsers);

export default router;

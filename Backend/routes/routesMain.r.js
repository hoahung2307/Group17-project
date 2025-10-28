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
    updateImageProfile , 
    forgotPassword, 
    refreshAccessToken,
    resetPassword , 
    deleteAccountFromAdmin , 
    deleteAccount 
} from '../controllers/controllerMain.c.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkRoleAdmin, checkRoleModerator, checkRoleUser } from '../middleware/checkrole.js';
import { validateImageProfile } from '../middleware/validation.js';
import { uploadCloudinary } from '../config/cloudinary.js';
    //user
    router.post("/user", postUsers);
    router.delete("/user/:id", deleteUsers);
    router.put("/user/:id", updateUsers);
    router.post("/user/deleteAccount", deleteAccount);
    router.get("/user/profile",protectRoute,getMe);
    router.put("/user/profile/avatar", protectRoute,uploadCloudinary.single('image'),validateImageProfile, updateImageProfile);
    router.put("/user/profile/name", protectRoute, updateName);
    router.put("/user/profile/password", protectRoute, updatePassword);
    //auth
    router.post("/auth/login", Login);
    router.post("/auth/register", Register);
    router.post("/auth/logout", logout);
    router.post("/auth/forgot-password", forgotPassword);
    router.post("/auth/reset-password/:resetPasswordToken", resetPassword);
    router.post("/auth/refresh", refreshAccessToken);
    
    //admin
    router.delete("/admin/users/:id", protectRoute, checkRoleAdmin, deleteAccountFromAdmin);
    router.get("/admin/users", protectRoute, checkRoleAdmin, getUsers);
export default router;
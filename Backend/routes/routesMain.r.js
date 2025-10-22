import express from 'express';
const router = express.Router();

import { getUsers, postUsers, deleteUsers, updateUsers, Login, Register, logout, getMe, updateName, updatePassword, updateImageProfile } from '../controllers/controllerMain.c.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { validateImageProfile } from '../middleware/validation.js';
import { uploadCloudinary } from '../config/cloudinary.js';
router.get('/', (req, res) => {
    res.send('trang chủ');
});
    router.get("/users",getUsers);
    router.post("/users", postUsers);
    router.delete("/users/:id", deleteUsers);
    router.put("/users/:id", updateUsers);
    router.post("/login", Login);
    router.post("/register", Register);
    router.post("/logout", logout);
    router.get("/profile", protectRoute, getMe);
    router.put("/profile/image", protectRoute,uploadCloudinary.single('image'),validateImageProfile, updateImageProfile);
    router.put("/profile/name", protectRoute, updateName);
    router.put("/profile/password", protectRoute, updatePassword);
export default router;
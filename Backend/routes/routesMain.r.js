import express from 'express';
const router = express.Router();
import { getUsers, postUsers, deleteUsers, updateUsers, Login, Register, logout } from '../controllers/controllerMain.c.js';
import { protectRoute } from '../middleware/protectRoute.js';
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
export default router;
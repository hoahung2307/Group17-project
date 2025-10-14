import express from 'express';
const router = express.Router();
import { getUsers, postUsers, deleteUsers, updateUsers } from '../controllers/controllerMain.c.js';
router.get('/', (req, res) => {
    res.send('trang chủ');
});
    router.get("/users",getUsers);

    router.post("/users", postUsers);
    router.delete("/users/:id", deleteUsers);
    router.put("/users/:id", updateUsers);

export default router;
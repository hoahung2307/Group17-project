import express from 'express';
const router = express.Router();
import { getUsers, postUsers } from '../controllers/controllerMain.c.js';
router.get('/', (req, res) => {
    res.send('trang chủ');
});
    router.get("/users",getUsers);

router.post("/users", postUsers);

export default router;
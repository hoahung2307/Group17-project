import "dotenv/config"
import express from 'express';
import mongoose from 'mongoose';
const app = express();
const port = 3000;
import routesMain from './routes/routesMain.r.js';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routesMain);

async function startServer() {
    try {
        await mongoose.connect("mongodb+srv://buoi4thuchanh:LiHP6X1lRCvkpdBA@cluster0.t8j20uy.mongodb.net/GroupDB")
        .then(() => console.log(" Connected to MongoDB"))
        .catch(err => console.error(" Connection error:", err));
    app.listen(port,()=>{
        console.log(`Server Started With Port ${port}`);
    })
    } catch (err) {
        console.log('Failed to start server', err);
    }
}

startServer();
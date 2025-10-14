import "dotenv/config"
import express from 'express';
const app = express();
const port = 3000;
import routesMain from './routes/routesMain.r.js';
app.use(routesMain);
async function startServer() {
    try {
    app.listen(port,()=>{
        console.log(`Server Started With Port ${port}`);
    })
    } catch (err) {
        console.log('Failed to start server', err);
    }
}

startServer();
import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth.ts'

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use('/auth', authRoutes); // mount auth flow


const server = app.listen(port, '127.0.0.1', () => {
    console.log(`App listening on port ${port}`);
});

server.on('error', (err) => {
    console.log('Sever failed to start:', err);
});
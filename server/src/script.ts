import express from 'express';
import session from 'express-session';
import authRoutes from './routes/auth.ts'
import path from 'node:path'
import './db/schema.ts' // runs once
import db from './db/client.ts'

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use('/auth', authRoutes); // mount auth flow

// app.get(/.*/, (req, res) => {
//     res.sendFile(path.resolve('', '../client/index.html'));
// });

const server = app.listen(port, '127.0.0.1', () => {
    console.log(`App listening on port ${port}`);
});

server.on('error', (err) => {
    console.log('Sever failed to start:', err);
});
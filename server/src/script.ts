import express from 'express';
import session from 'express-session';

const app = express();
const port = 3000;

app.get("/", (req, res) => {
    res.send("Hello world!");
});

const server = app.listen(port, '127.0.0.1', () => {
    console.log(`App listening on port ${port}`);
});

server.on('error', (err) => {
    console.log('Sever failed to start:', err);
});
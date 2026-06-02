import express from 'express';
import session from 'express-session';
import SqliteStore from 'better-sqlite3-session-store';
import path from 'node:path'
import authRoutes from './routes/auth.ts'
import './db/schema.ts' // runs once to initialize db
import db from './db/client.ts'

const app = express();
const port = 3000;
const SqliteStoreInstance = SqliteStore(session);

// NOTE: app does not currently use any parsing middleware such as express.json() 

app.use(session({
    store: new SqliteStoreInstance({
        client: db,
        expired: {
            clear: true,
            intervalMs: 900000 // clear expired sessions every 15 minutes (global timer)
        }
    }),
    secret: process.env.SESSION_SECRET!,
    cookie: {
        httpOnly: true, // prevents JS access to cookie (security)
        secure: false, // TODO edit to true in prod (need HTTPS)
        sameSite: 'strict'
    },
    resave: false,
    saveUninitialized: false
}));

app.get("/", (req, res) => {
    res.send("Hello world!");
});

app.use('/auth', authRoutes); // mount auth flow

app.get(/.*/, (req, res) => { // catch-all
    res.sendFile(path.resolve('', '../client/index.html'));
});

const server = app.listen(port, '127.0.0.1', () => {
    console.log(`App listening on port ${port}`);
});

server.on('error', (err) => {
    console.error('Sever failed to start:', err);
});
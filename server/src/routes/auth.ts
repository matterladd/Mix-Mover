import express, { Router } from 'express';
import db from '../db/client.ts'

const authRoutes = Router();

authRoutes.use(express.json()); // expect and parse json requests

authRoutes.post('/login', (req, res) => {
    const { email } = req.body;
    const getUser = db.prepare('SELECT * FROM users WHERE email = ?');
    const user: any = getUser.get(email); // TODO: make types for db return data
    if (user) {
        req.session.userId = user.id;
        console.log(req.session.userId); // TODO: remove
        res.status(200).json({ success: true });
        return;
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

authRoutes.use('/signup', (req, res) => {
    const { email } = req.body;
    const getUser = db.prepare('SELECT * FROM users WHERE email = ?');
    const addUser = db.prepare('INSERT INTO users (email) VALUES (?)');
    if (getUser.get(email)) { // returns undefined if not found in table
        res.status(401).json({ error: 'User already exists'});
        return;
    }
    addUser.run(email); // TODO: Error checking and handling
    res.status(200).json({ success: true });
});

authRoutes.use('/', (req, res) => {
    res.redirect('http://example.com');
});

export default authRoutes;
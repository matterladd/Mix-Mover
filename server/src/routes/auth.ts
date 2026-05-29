import express, { Router } from 'express';
import 'express-session'; // include for types
import bcrypt from 'bcrypt';
import db from '../db/client.ts'

const SALT_ROUNDS = 12;
const authRoutes = Router();

authRoutes.use(express.json()); // expect and parse json requests

authRoutes.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const getUser = db.prepare('SELECT * FROM users WHERE email = ?');
    const user: any = getUser.get(email); // TODO: make types for db return data
    if (user) { // TODO: logic here can be improved
        const match = await bcrypt.compare(password, user.password_hash); // TODO: error checking
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        req.session.userId = user.id;
        res.status(200).json({ success: true });
        return;
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

authRoutes.use('/signup', async (req, res) => {
    const { email, password } = req.body;
    const getUser = db.prepare('SELECT * FROM users WHERE email = ?');
    const addUser = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
    if (getUser.get(email)) { // returns undefined if not found in table
        res.status(401).json({ error: 'User already exists'});
        return;
    }
    const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);
    addUser.run(email, hashed_password); // TODO: Error checking and handling
    res.status(200).json({ success: true });
});

authRoutes.use('/', (req, res) => {
    res.redirect('http://example.com');
});

export default authRoutes;
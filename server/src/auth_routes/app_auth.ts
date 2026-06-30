import express, { Router } from 'express';
import 'express-session'; // include for types
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, addUser } from '../db/queries.ts';

const SALT_ROUNDS = 12;
const app_auth_routes = Router();

app_auth_routes.use(express.json()); // expect and parse json requests

app_auth_routes.post('/login', async (req, res) => { // TODO: are async functions handled correctly by express?
    const { email, password } = req.body;
    const user = getUserByEmail.get(email);
    if (user) { // TODO: logic here can be improved
        const match = await bcrypt.compare(password, user.password_hash); // TODO: error checking
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        req.session.user_id = user.id;
        res.status(200).json({ id: user.id, email: email });
        return;
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

app_auth_routes.post('/logout', (req, res) => {
    req.session.destroy((err) => { // is an asynchronous function, try/catch does not work like you think
        if (err) {
            console.error(err);
            res.status(500).json({error: 'logout failed'});
            return;
        }
        res.clearCookie('connect.sid'); // default session cookie name
        res.json({ success: true });
    });
});

app_auth_routes.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (getUserByEmail.get(email)) { // returns undefined if not found in table
        res.status(401).json({ error: 'User already exists'});
        return;
    }
    const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);
    const result = addUser.run(email, hashed_password); // TODO: Error checking and handling
    req.session.user_id = result.lastInsertRowid as number;
    res.status(200).json({ success: true });
});

export default app_auth_routes;
import express, { Router } from 'express';
import 'express-session'; // include for types
import bcrypt from 'bcrypt';
import { getUserByEmail, getUserById, addUser } from '../db/queries.ts';

const SALT_ROUNDS = 12;
const auth_routes = Router();

auth_routes.use(express.json()); // expect and parse json requests

auth_routes.post('/login', async (req, res) => { // TODO: are async functions handled correctly by express?
    const { email, password } = req.body;
    const user = getUserByEmail.get(email);
    if (user) { // TODO: logic here can be improved
        const match = await bcrypt.compare(password, user.password_hash); // TODO: error checking
        if (!match) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        req.session.user_id = user.id;
        res.status(200).json({ success: true });
        return;
    }
    res.status(401).json({ error: 'Invalid credentials' });
});

auth_routes.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    if (getUserByEmail.get(email)) { // returns undefined if not found in table
        res.status(401).json({ error: 'User already exists'});
        return;
    }
    const hashed_password = await bcrypt.hash(password, SALT_ROUNDS);
    addUser.run(email, hashed_password); // TODO: Error checking and handling
    res.status(200).json({ success: true });
});

auth_routes.get('/me', (req, res) => {
    if (!req.session.user_id) {
        res.status(401).json({ error: 'not logged in' });
        return;
    }
    const user: any = getUserById.get(req.session.user_id);
    if (!user){
        res.status(404).json({ error: 'user does not exist. How\'d you get a session?'});
        return;
    }
    res.json({id: user.id, email: user.email});
});

export default auth_routes;
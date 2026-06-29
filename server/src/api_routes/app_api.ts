import express, { Router } from 'express';
import 'express-session'; // include for types
import { getUserById } from '../db/queries.ts';

const app_api_routes = Router();

app_api_routes.use(express.json());

app_api_routes.get('/me', (req, res) => {
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

export default app_api_routes;
import express, { Router } from 'express';
import 'express-session'; // include for types
import { User, Token, Playlist, SpotifyTokenRefreshObj } from '../types';
import { addTokensForUser, getSpotifyTokens } from '../db/queries.ts';

const spotify_api_routes = Router();
const api_url = 'https://api.spotify.com/v1';

spotify_api_routes.use(express.json());

spotify_api_routes.get('/me', async (req, res) => {
    const tokens = getSpotifyTokens.get(req.session.user_id);
    try {
        const response = await fetch(`${api_url}/me`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${tokens.access_token}`
           } 
        });
        if (!response.ok) throw new Error('could not fetch user info. status ' + response.status);
        const data = await response.json();
        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to find user info' });
    }
});

export default spotify_api_routes
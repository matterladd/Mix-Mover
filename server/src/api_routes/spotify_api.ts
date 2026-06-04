import express, { Router } from 'express';
import 'express-session'; // include for types
import { User, Token, Playlist, SpotifyUser } from '../types';
import { addSpotifyUser, getSpotifyTokens } from '../db/queries.ts';

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
        const data: SpotifyUser = await response.json();
        addSpotifyUser.run( // TODO: error checking
            req.session.user_id,
            data.account_id,
            data.display_name,
            data.external_urls.spotify,
            data.href,
            data.image_url, // TODO: incorrect way to access the image_url
            data.uri
        );
        res.json(data);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to find user info' });
    }
});

export default spotify_api_routes
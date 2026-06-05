import express, { Router } from 'express';
import 'express-session'; // include for types
import { User, Token, Playlist, SpotifyUser } from '../types';
import { addSpotifyUser, getSpotifyTokens, getSpotifyUser } from '../db/queries.ts';
import refresh_spotify_access_token from '../services/refresh_access_tokens.ts';

const spotify_api_routes = Router();
const api_url = 'https://api.spotify.com/v1';

spotify_api_routes.use(express.json());

spotify_api_routes.get('/me', async (req, res) => {
    const spotify_user: SpotifyUser = getSpotifyUser.get(req.session.user_id);

    // use database data first if it exists
    if (spotify_user) {

        res.json(spotify_user);

    } else {
        refresh_spotify_access_token(req.session.user_id); // TODO: May not need to refresh every time
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
    }
});

export default spotify_api_routes
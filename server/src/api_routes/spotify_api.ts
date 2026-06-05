import express, { Router } from 'express';
import 'express-session'; // include for types
import { User, Token, Playlist, SpotifyUser } from '../types';
import { addSpotifyUser, getSpotifyTokens, getSpotifyUser } from '../db/queries.ts';
import refresh_spotify_access_token from '../services/refresh_access_tokens.ts';

const spotify_api_routes = Router();
const api_url = 'https://api.spotify.com/v1';

spotify_api_routes.use(express.json());

/**
 * Retrieve data about the user
 */
spotify_api_routes.get('/me', async (req, res) => {
    const spotify_user: SpotifyUser | undefined = getSpotifyUser.get(req.session.user_id!);

    // use database data first if it exists
    if (spotify_user) {

        res.json(spotify_user);

    } else {
        await refresh_spotify_access_token(req.session.user_id!); // TODO: May not need to refresh every time
        const tokens = getSpotifyTokens.get(req.session.user_id!);
        // TODO: if token expired...
        // TODO: if token does not exist (returns undefined)...
        try {
            const response = await fetch(`${api_url}/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${tokens!.access_token}`
               } 
            });
            const data = await response.json();
            if (!response.ok) throw new Error(`could not fetch user info\nstatus ${response.status}\n${data.error.message}`);
            addSpotifyUser.run( // TODO: error checking
                req.session.user_id!,
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

/**
 * Create a new playlist
 * @param req body contains exact JSON needed by Spotify
 */
spotify_api_routes.post('/playlists', async (req, res) => {
    await refresh_spotify_access_token(req.session.user_id!); // TODO: May not need to refresh every time
    const tokens = getSpotifyTokens.get(req.session.user_id!);
    const body = req.body;
    try {
        const response = await fetch(`${api_url}/me/playlists`, {
            method: 'POST',
            headers: { 
                Authorization: `Bearer ${tokens!.access_token}`,
                'Content-Type': 'application/json'
            }, 
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(`failed to create new playlist\nstatus ${response.status}\n${data.error.message}`);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.json({error: 'failed to create new playlist'});
    }
});

export default spotify_api_routes
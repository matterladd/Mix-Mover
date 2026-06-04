import express, { Router } from 'express';
import 'express-session'; // include for types
import { User, Token, Playlist, SpotifyTokenRefreshObj } from '../types';
import { addTokensForUser, getSpotifyTokens } from '../db/queries.ts';

const spotify_auth_routes = Router();
const accounts_url = 'https://accounts.spotify.com'
const api_url = 'https://api.spotify.com'
const redirect_uri = 'http://127.0.0.1:3000/api/spotify_auth/callback';

spotify_auth_routes.use(express.json());

/**
 * Begin first-time authorization with the OAuth Authorization Code Flow
 */
spotify_auth_routes.get('/', (req, res) => {
    const state = String(req.session.user_id); // Use the state to encode the user id which goes around the strict cookies // TODO: is this safe?
    const scope = 'user-read-private user-read-email'; // all scopes needed for app
    const query_params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!, // TODO: why `!`?
        response_type: 'code',
        redirect_uri: redirect_uri,
        state: state,
        scope: scope
    });
    res.redirect(`${accounts_url}/authorize?${query_params.toString()}`);
});

/**
 * Endpoint for OAuth callback providing an authorization code.
 * Gets a new access token + refresh token and writes to database
 */
spotify_auth_routes.get('/callback', async (req, res) => {
    const auth_code = String(req.query.code);
    const state = req.query.state
    try {
        if (state != '1') throw new Error(`state does not match, state ${state}`); // TODO: fix hardcoded
        const response = await fetch(`${accounts_url}/api/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              code: auth_code,
              redirect_uri: redirect_uri
            })
        });
        if (!response.ok) throw new Error('unable to get api token, status ' + response.status);
        const data: SpotifyTokenRefreshObj = await response.json();
        const token_obj: Token = {
            user_id: state,
            service: 'spotify',
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_in // TODO: inacurrate (at != in)
        }
        addTokensForUser(token_obj);

    } catch (err) {
        console.error(err);
    }
    res.redirect('http://127.0.0.1:5173/');
});

/**
 * Refresh a user's access token
 */
spotify_auth_routes.post('/refresh_access', async (req, res) => { // TODO POST or GET?
    const token = getSpotifyTokens.get(req.session.user_id);
    try {
        const response = await fetch(`${accounts_url}/api/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
            },
            body: new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: token.access_token
            })
        });
        if (!response.ok) throw new Error('unable to refresh api token, status ' + response.status);
        const data: SpotifyTokenRefreshObj = await response.json();
        const token_obj: Token = {
            user_id: req.session.user_id,
            service: 'spotify',
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_in // TODO: inacurrate (at != in)
        }
        addTokensForUser(token_obj);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'failed to refresh access token' });
    }
});

export default spotify_auth_routes;
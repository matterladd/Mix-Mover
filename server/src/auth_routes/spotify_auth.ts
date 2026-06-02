import express, { Router } from 'express';
import 'express-session'; // include for types
import { User, Token, Playlist, SpotifyTokenRefreshObj } from '../types';
import { addTokensForUser } from '../db/queries.ts';

const spotify_auth_routes = Router();
const accounts_url = 'https://accounts.spotify.com'
const api_url = 'https://api.spotify.com'

spotify_auth_routes.use(express.json());

spotify_auth_routes.get('/', (req, res) => { // begin the auth flow using Authorization Code Flow
    const state = String(req.session.user_id); // Use the state to encode the user id which goes around the strict cookies // TODO: is this safe?
    const scope = 'user-read-private user-read-email'; // all scopes needed for app
    const query_params = new URLSearchParams({
        client_id: process.env.SPOTIFY_CLIENT_ID!, // TODO: why `!`?
        response_type: 'code',
        redirect_uri: 'http://127.0.0.1:3000/spotify_auth/callback',
        state: state,
        scope: scope
    });
    res.redirect(`${accounts_url}/authorize?${query_params.toString()}`);
});

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
              redirect_uri: 'http://127.0.0.1:3000/spotify_auth/callback'
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

export default spotify_auth_routes;
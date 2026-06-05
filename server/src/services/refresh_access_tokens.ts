import { getSpotifyTokens, addTokensForUser } from "../db/queries";
import { SpotifyTokenRefreshObj } from "../types";

const accounts_url = 'https://accounts.spotify.com'

export default async function refresh_spotify_access_token(user_id: number) {
    const token = getSpotifyTokens.get(user_id);
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
            user_id: user_id,
            service: 'spotify',
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_in // TODO: inacurrate (at != in)
        }
        addTokensForUser(token_obj);

    } catch (err) {
        console.error(err);
    }
}
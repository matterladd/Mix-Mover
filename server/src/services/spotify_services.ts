import { getSpotifyTokens, addTokensForUser, addPlaylist } from "../db/queries";
import { Track, SpotifyTokenRefreshObj, Token, SpotifyPlaylist } from "../types";

const accounts_url = 'https://accounts.spotify.com';
const api_url = 'https://api.spotify.com/v1';

export async function refresh_spotify_access_token(user_id: number) {
    const token = getSpotifyTokens.get(user_id); // TODO: if token is undefined...
    const response = await fetch(`${accounts_url}/api/token`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: token!.refresh_token!
        })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(`unable to refresh access token, status ${response.status}`);
    const token_obj: Token = {
        user_id: user_id,
        service: 'spotify',
        access_token: data.access_token,
        refresh_token: data.refresh_token ?? token!.refresh_token!,
        expires_at: data.expires_in // TODO: inacurrate (at != in)
    }
    addTokensForUser(token_obj);
}

export async function create_spotify_playlist(user_id: number, body: SpotifyPlaylist) {
    await refresh_spotify_access_token(user_id); // TODO: May not need to refresh every time
    const tokens = getSpotifyTokens.get(user_id);
    const response = await fetch(`${api_url}/me/playlists`, {
        method: 'POST',
        headers: { 
            Authorization: `Bearer ${tokens!.access_token}`,
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(`failed to create new playlist, status ${response.status}, ${data.error.message}`);

    addPlaylist.run( // TODO: error checking
        user_id,
        'spotify',
        null,
        data.id,
        null,
        data.external_urls.spotify,
        null,
        data.name
    );

    return data; // gives full data from Spotify if needed by caller
}

export async function add_spotify_tracks(user_id: number, playlist_id: string, tracks: string[]) {
    await refresh_spotify_access_token(user_id); // TODO: May not need to refresh every time
    const tokens = getSpotifyTokens.get(user_id);
    const body = { uris: tracks }
    const response = await fetch(`${api_url}/playlists/${playlist_id}/items`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${tokens!.access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });

    const data = await response.json();
    if (!response.ok) throw new Error(`unable to add tracks to playlist, status ${response.status}, ${data.error.message}`);
}

export async function search_spotify_track(
    user_id: number, // TODO: Too many requests to DB, pass in API key???
    track: string, 
    artist: string
): Promise<string | null> {
    const token = getSpotifyTokens.get(user_id); // TODO: if token is undefined
    const query = new URLSearchParams({
        q: `track:${track} artist:${artist}`,
        type: 'track',
        limit: '1'
    });

    const response = await fetch(`${api_url}/search?${query}`, {
        headers: { Authorization: `Bearer ${token!.access_token}`}
    });
    const data = await response.json();
    /**
     * important things that the request returns:
     * ISRC code: International Sound Recording Identifier
     * Spotify ID: internal spotify identifier
     */
    if (!response.ok) throw new Error(`could not fetch track, status ${response.status}, ${data.error.message}`);
    const result = data.tracks?.items?.[0]; // access items[0] only if it exists
    return result?.uri ?? null; // null if track is not found, otherwise returns Spotify URI
}
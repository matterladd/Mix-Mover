import express, { Router } from 'express';
import 'express-session'; // include for types
import Bottleneck from 'bottleneck';
import { SpotifyUser } from '../types/index.js';
import { addSpotifyUser, getSpotifyTokens, getSpotifyUser } from '../db/queries.js';
import { scrape_apple_playlist } from '../services/apple_services.js';
import { 
    refresh_spotify_access_token, 
    create_spotify_playlist, 
    add_spotify_tracks, 
    search_spotify_track
} from '../services/spotify_services.js';

// module scope to persist the same instance for each api call
const limiter = new Bottleneck({
    maxConcurrent: 10,
    reservoir: 50,
    
});

const spotify_api_routes = Router();
const api_url = 'https://api.spotify.com/v1';

spotify_api_routes.use(express.json());

/**
 * Retrieve data about the user
 */
spotify_api_routes.get('/me', async (req, res, next) => {
    try {
        const spotify_user: SpotifyUser | undefined = getSpotifyUser.get(req.session.user_id!);
    
        // use database data first if it exists
        if (spotify_user) {
    
            res.json(spotify_user);
    
        } else {
            await refresh_spotify_access_token(req.session.user_id!); // TODO: May not need to refresh every time
            const tokens = getSpotifyTokens.get(req.session.user_id!);
            // TODO: if token expired...
            // TODO: if token does not exist (returns undefined)...
            const response = await fetch(`${api_url}/me`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${tokens!.access_token}`
                } 
            });
            const data = await response.json();
            if (!response.ok) throw new Error(`could not fetch user info, status ${response.status}, ${data.error.message}`);
            addSpotifyUser.run( // TODO: error checking
                req.session.user_id!,
                data.account_id,
                data.display_name,
                data.external_urls.spotify,
                data.href,
                data.images[0].url,
                data.uri
            );
            res.json(data);
        }
    } catch (err) {
        console.error(err);
        next(new Error(`Could not fetch user info`));
    }
});

/**
 * POST body contains an Apple Music playlist link
 * TODO: error checking?
 */
spotify_api_routes.post('/convert-apple', async (req, res, next) => {
    /**
     * Steps:
     * 1. Check if user has session
     * 2. Check if user has Spotify account
     * 3. Check if API token needs refreshed
     * 4. Get playlist data from Apple Music
     * 5. Create new playlist with same title on Spotify
     * 6. Search for equivalent tracks on Spotify
     * 7. Add tracks to the new Spotify playlist
     * 8. Log playlist in DB
     * 9. Return success or failure (missing tracks, etc)
     */
    try {
        await refresh_spotify_access_token(req.session.user_id!); // TODO: too many refreshes
        const { link: apple_link } = req.body as { link: string }; // unpacks body and renames link to apple_link
        const apple_data = await scrape_apple_playlist(apple_link);
        const spotify_playlist_data = await create_spotify_playlist(req.session.user_id!, {
            name: apple_data.name,
            description: `via ${apple_link}`, // TODO: find description
            public: false
        });
    
        // batch requests to deal with rate limiting
        const all_tracks = apple_data.tracks.map(track =>
            limiter.schedule(() => search_spotify_track(req.session.user_id!, track.name, track.artist))
        );

        // wait for results from all of the promises
        const search_results = await Promise.all(all_tracks);
        await add_spotify_tracks(req.session.user_id!, spotify_playlist_data.id, search_results.filter(uri => uri !== null));
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        next(new Error(`Conversion failed`));
    }
});

export default spotify_api_routes;
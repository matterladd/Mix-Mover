import env from "../config/env.js";
import express, { Router } from "express";
import "express-session"; // include for types
import Bottleneck from "bottleneck";
import {
  RateLimitError,
  SpotifyError,
  SpotifyUserData,
} from "../types/index.js";
import {
  addSpotifyUser,
  getSpotifyTokens,
  getSpotifyUser,
} from "../db/queries.js";
import { scrape_apple_playlist } from "../services/apple_services.js";
import {
  refresh_spotify_access_token,
  create_spotify_playlist,
  add_spotify_tracks,
  search_spotify_track,
} from "../services/spotify_services.js";

// * Module scope to persist the same instance for each api call
const limiter = new Bottleneck({
  maxConcurrent: 10,
});

// * Whatever value is returned is the waiting period for a retry
limiter.on("failed", (error: RateLimitError, jobInfo) => {
  // TODO may not be RateLimitError
  if (error.retryAfter) {
    const waitMs = error.retryAfter * 1000;
    console.warn(`retrying job ${jobInfo.options.id} in ${waitMs} ms`);
    return waitMs;
  }
  throw error;
});

// * Set up the routes
const spotify_api_routes = Router();
spotify_api_routes.use(express.json());

/**
 * Retrieve data about the user
 */
spotify_api_routes.get("/me", async (req, res, next) => {
  // * Check session and store locally instead of using reference to req.session
  if (!req.session.user_id) throw new Error("User has no session.");
  const user_id = req.session.user_id;

  try {
    // * Give database data first if it exists
    const spotify_user = getSpotifyUser.get(user_id);
    if (spotify_user) res.json(spotify_user);

    // * Otherwise
    else {
      // * Get Spotify access token for user
      await refresh_spotify_access_token(user_id); // TODO: May not need to refresh every time
      const tokens = getSpotifyTokens.get(user_id);
      if (!tokens) throw new Error("User's Spotify tokens not found.");

      // * Send API request
      const response = await fetch(`${env.SPOTIFY_API_URL}/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      const raw_data: unknown = await response.json();
      if (!response.ok) {
        const data = raw_data as SpotifyError;
        throw new Error(
          `could not fetch user info, status ${response.status}, ${data.error.message}`,
        );
      }

      // * Write User data to database
      const data = raw_data as SpotifyUserData;
      addSpotifyUser.run(
        // TODO: error checking
        user_id,
        data.account_id,
        data.display_name,
        data.external_urls.spotify,
        data.href,
        data.images[0].url,
        data.uri,
      );

      // * Give User data
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
spotify_api_routes.post("/convert-apple", async (req, res, next) => {
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
    // * Check session and store locally instead of using reference to req.session
    if (!req.session.user_id) throw new Error("User has no session.");
    const user_id = req.session.user_id;
    await refresh_spotify_access_token(user_id); // TODO: too many refreshes

    // * Unpacks body and renames link to apple_link
    const { link: apple_link } = req.body as { link: string };
    const apple_data = await scrape_apple_playlist(apple_link);

    // * Batch requests to deal with rate limiting
    const all_tracks = apple_data.tracks.map((track) =>
      limiter.schedule(() =>
        search_spotify_track(user_id, track.name, track.artist),
      ),
    );

    // * Wait for results from all of the promises
    const search_results = await Promise.all(all_tracks);

    // * Create playlist and add tracks
    const spotify_playlist_data = await create_spotify_playlist(user_id, {
      name: apple_data.name,
      description: `via ${apple_link}`, // TODO: find description
      public: false,
    });
    await add_spotify_tracks(
      user_id,
      spotify_playlist_data.id,
      search_results.filter((uri) => uri !== null),
    );
    res.json({ success: true, playlist_link: spotify_playlist_data.external_urls.spotify });
  } catch (err) {
    console.error(err); // backend error message
    next(new Error(`Conversion failed`)); // error message to forward to frontend
  }
});

export default spotify_api_routes;

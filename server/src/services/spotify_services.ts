import {
  getSpotifyTokens,
  addTokensForUser,
  addPlaylist,
} from "../db/queries.js";
import {
  Token,
  SpotifyInitPlaylist,
  SpotifyRefreshToken,
  SpotifyPlaylist,
  SpotifyError,
  SpotifySearchResults,
  RateLimitError
} from "../types/index.js";

const accounts_url = "https://accounts.spotify.com";
const api_url = "https://api.spotify.com/v1";

/**
 * Get a new access token from Spotify with your refresh token
 * @param user_id MixMover's internal User ID
 */
export async function refresh_spotify_access_token(
  user_id: number,
): Promise<void> {
  // * Check if env variables exist
  if (!process.env.SPOTIFY_CLIENT_ID)
    throw new Error("SPOTIFY_CLIENT_ID environment variable not set.");
  if (!process.env.SPOTIFY_CLIENT_SECRET)
    throw new Error("SPOTIFY_CLIENT_SECRET environment variable not set.");

  // * Get user's Spotify access and refresh tokens
  const tokens = getSpotifyTokens.get(user_id);
  if (!tokens) throw new Error("User's Spotify tokens not found.");

  // * Send API request
  const response = await fetch(`${accounts_url}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: tokens.refresh_token,
    }),
  });

  // * Parse the raw data and update token(s)
  const raw_data: unknown = await response.json();
  if (!response.ok) {
    const data = raw_data as SpotifyError;
    throw new Error(
      `unable to refresh access token, status ${response.status}, ${data.error.message}`,
    );
  }
  const data = raw_data as SpotifyRefreshToken;
  const token_obj: Token = {
    user_id: user_id,
    service: "spotify",
    access_token: data.access_token,
    refresh_token: data.refresh_token ?? tokens.refresh_token,
    expires_at: data.expires_in, // TODO: inacurrate (at != in)
  };
  addTokensForUser(token_obj);
}

/**
 * Creates a new Spotify Playlist with data provided
 * @param user_id MixMover's internal User ID
 * @param body Contains options for the playlist such as name and description
 * @returns Promise of a SpotifyPlaylist object
 */
export async function create_spotify_playlist(
  user_id: number,
  body: SpotifyInitPlaylist,
): Promise<SpotifyPlaylist> {
  // * Get Spotify access token for user
  await refresh_spotify_access_token(user_id); // TODO: May not need to refresh every time
  const tokens = getSpotifyTokens.get(user_id);
  if (!tokens) throw new Error("User's Spotify tokens not found.");

  // * Send API request
  const response = await fetch(`${api_url}/me/playlists`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // * Handle response
  const raw_data: unknown = await response.json();
  if (!response.ok) {
    const data = raw_data as SpotifyError;
    throw new Error(
      `failed to create new playlist, status ${response.status}, ${data.error.message}`,
    );
  }
  // * Save playlist to MixMover database
  const data = raw_data as SpotifyPlaylist;
  addPlaylist.run(
    // TODO: error checking
    user_id,
    "spotify",
    null,
    data.id,
    null,
    data.external_urls.spotify,
    null,
    data.name,
  );

  return data;
}

/**
 * Add a list of tracks to an existing playlist
 * @param user_id MixMover's internal User ID
 * @param playlist_id Spotify ID for playlist
 * @param tracks Array of Spotify URIs representing tracks
 */
export async function add_spotify_tracks(
  user_id: number,
  playlist_id: string,
  tracks: string[],
): Promise<void> {
  // * Get Spotify access token for user
  await refresh_spotify_access_token(user_id); // TODO: May not need to refresh every time
  const tokens = getSpotifyTokens.get(user_id);
  if (!tokens) throw new Error("User's Spotify tokens not found.");

  // * Wrap tracks into what the API is expecting
  const body = { uris: tracks };

  // * Send API request
  const response = await fetch(`${api_url}/playlists/${playlist_id}/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  // * Handle response
  const raw_data: unknown = await response.json();
  if (!response.ok) {
    const data = raw_data as SpotifyError;
    throw new Error(
      `unable to add tracks to playlist, status ${response.status}, ${data.error.message}`,
    );
  }
}

/**
 * Searches Spotify for a track
 * @param user_id MixMover's internal User ID
 * @param track Name of the track
 * @param artist Artist associated with the track
 * @returns Promise of Spotify URI of track or `null` if not found
 */
export async function search_spotify_track(
  user_id: number, // TODO: Too many requests to DB, pass in API key???
  track: string,
  artist: string,
): Promise<string | null> {
  // * Get Spotify access token for user
  const tokens = getSpotifyTokens.get(user_id);
  if (!tokens) throw new Error("User's Spotify tokens not found.");

  // * Setup query
  const query = new URLSearchParams({
    q: `track:${track} artist:${artist}`,
    type: "track",
    limit: "1",
  });

  // * Send API request
  const response = await fetch(`${api_url}/search?${query}`, {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  // * Handle response and return
  const raw_data: unknown = await response.json();
  /**
   * important things that the request returns:
   * ISRC code: International Sound Recording Identifier
   * Spotify ID: internal spotify identifier
   */
  if (!response.ok) {
    const data = raw_data as SpotifyError;
    if (response.status === 429) {
      throw new RateLimitError(
        parseInt(response.headers.get("Retry-After") ?? "0"),
      );
    }
    throw new Error(
      `could not fetch track, status ${response.status}, ${data.error.message}.}`,
    );
  }
  const data = raw_data as SpotifySearchResults;
  const result = data.tracks?.items?.[0]; // access items[0] only if it exists
  return result?.uri ?? null; // null if track is not found, otherwise returns Spotify URI
}

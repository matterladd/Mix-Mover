import db from "./client.js";
import { User, Token, Playlist, SpotifyUser } from "../types/index.js";

export const getUserById = db.prepare<[number], User>(
  "SELECT * FROM users WHERE id = ?",
);
export const getUserByEmail = db.prepare<[string], User>(
  "SELECT * FROM users WHERE email = ?",
);
export const addUser = db.prepare<[string, string], User>(
  "INSERT INTO users (email, password_hash) VALUES (?, ?)",
); // TODO: correct return type?

/**
 * Should only be used for first time token insertion for a user, see `updateTokensForUser`
 */
export const addTokensForUser = db.transaction((t: Token) => {
  const user = getUserById.get(t.user_id);
  if (!user) throw new Error(`User ${t.user_id} does not exist`); // checks if user exists before adding
  insertSpotifyToken.run(
    t.user_id,
    t.service,
    t.access_token,
    t.refresh_token,
    t.expires_at,
  );
});
const insertSpotifyToken = db.prepare<
  [number, string, string, string | null, string | null],
  Token
>(`
    INSERT OR REPLACE INTO tokens (user_id, service, access_token, refresh_token, expires_at)
    VALUES (?, ?, ?, ?, ?)
    `); // TODO: REPLACE may not be needed here

export const getSpotifyTokens = db.prepare<[number], Token>(
  "SELECT * FROM tokens WHERE user_id = ? AND service = 'spotify';",
);
export const addSpotifyUser = db.prepare<
  [
    number,
    string,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
  ],
  SpotifyUser
>(`
    INSERT OR REPLACE INTO spotify_users (user_id, account_id, display_name, external_url, href, image_url, uri) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
`);
export const getSpotifyUser = db.prepare<[number], SpotifyUser>(
  "SELECT * FROM spotify_users WHERE user_id = ?",
);
export const addPlaylist = db.prepare<
  [
    number,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string | null,
    string,
  ],
  Playlist
>(`
    INSERT INTO playlists (user_id, source_service, target_service, source_id, target_id, source_url, target_url, name)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)    
`);

import db from './client.ts'
import { User, Token, Playlist } from '../types';

export const getUserById =      db.prepare<[number], User>('SELECT * FROM users WHERE id = ?');
export const getUserByEmail =   db.prepare<[string], User>('SELECT * FROM users WHERE email = ?');
export const addUser =          db.prepare<[string, string], User>('INSERT INTO users (email, password_hash) VALUES (?, ?)'); // TODO: correct return type?
export const addTokensForUser = db.transaction((t: Token) => {
    const user = getUserById.get(t.user_id);
    if (!user) throw new Error(`User ${t.user_id} does not exist`); // checks if user exists before adding
    insertSpotifyToken.run(t.user_id, t.service, t.access_token, t.refresh_token, t.expires_at);
});

export const getSpotifyTokens = db.prepare<[number], Token>('SELECT * FROM tokens WHERE user_id = ? AND service = "spotify";');

const insertSpotifyToken = db.prepare<[number, string, string, string | null, string | null], Token>(`
    INSERT OR REPLACE INTO tokens (user_id, service, access_token, refresh_token, expires_at)
    VALUES (?, ?, ?, ?, ?)
`);


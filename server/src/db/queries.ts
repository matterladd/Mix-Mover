import db from './client.ts'
import { User, Token, Playlist } from '../types';

export const getUserById =      db.prepare<[number], User>('SELECT * FROM users WHERE id = ?');
export const getUserByEmail =   db.prepare<[string], User>('SELECT * FROM users WHERE email = ?');
export const addUser =          db.prepare<[string, string], User>('INSERT INTO users (email, password_hash) VALUES (?, ?)');

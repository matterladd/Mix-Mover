export interface User {
    id: number;
    email: string;
    password_hash: string;
    created_at: string;
}

export interface Token {
    id: number;
    user_id: number;
    service: string;
    access_token: string;
    refresh_token: string | null;
    expires_at: string | null;
}

export interface Playlist {
    id: number;
    user_id: number;
    source_service: string;
    target_service: string;
    source_id: string;
    target_id: string;
    name: string;
    created_at: string | null;
}

export interface SpotifyTokenRefreshObj {
    access_token: string,
    token_type: string,
    expires_in: string,
    refresh_token: string,
    scope: string
}
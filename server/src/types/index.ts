export interface User {
    id?: number;
    email: string;
    password_hash: string;
    created_at: string;
}

export interface Token {
    id?: number;
    user_id: number;
    service: string;
    access_token: string;
    refresh_token: string | null;
    expires_at: string | null;
}

export interface Playlist {
    id?: number;
    user_id: number;
    source_service: string;
    target_service: string | null;
    source_id: string;
    target_id: string | null;
    source_url: string;
    target_url: string | null;
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

export interface SpotifyUser {
    id: number;
    user_id: number;
    account_id: string;
    display_name: string | null;
    external_url: string | null;
    href: string | null;
    image_url: string | null;
    uri: string | null;
}

export interface SpotifyPlaylist {
    name: string;
    description: string | null;
    public: boolean;
}

export interface Track {
    name: string;
    artist: string;
}

export interface ApplePlaylist {
    name: string;
    tracks: Track[];
}
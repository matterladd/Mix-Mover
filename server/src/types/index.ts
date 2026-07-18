// * External API types

export interface SpotifyError {
  error: {
    status: number;
    message: string;
  };
}

export interface SpotifyInitToken {
  access_token: string;
  token_type: string;
  expires_in: string; // seconds token is valid
  refresh_token: string;
  scope: string;
}

export interface SpotifyRefreshToken {
  access_token: string;
  token_type: string;
  expires_in: string; // seconds token is valid
  refresh_token?: string;
  scope: string;
}

export interface SpotifyInitPlaylist {
  name: string;
  description: string | null;
  public: boolean;
}

export interface SpotifyPlaylist {
  id: string; // Spotify ID for playlist
  external_urls: {
    spotify: string;
  };
  name: string;
}

export interface SpotifySearchResults {
  tracks?: {
    items?: SpotifyTrackObject[];
  };
}

export interface SpotifyTrackObject {
  uri: string;
}

// ! NOT the same as SpotifyUser
export interface SpotifyUserData {
  account_id: string;
  display_name: string;
  external_urls: {
    spotify: string;
  }
  href: string;
  images: SpotifyImageObject[];
  uri: string;
}

export interface SpotifyImageObject {
  url: string;
  height: number | null;
  width: number | null;
}

export interface Track {
  name: string;
  artist: string;
}

export interface ApplePlaylist {
  name: string;
  tracks: Track[];
}

// * Database types

/**
 * NOTE: `id` is `?` to account for
 * insertions into DB. `id` is
 * auto-generated when inserted
 * but also returned when queried.
 */
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
  refresh_token: string;
  expires_at: string;
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

export interface SpotifyUser {
  id?: number;
  user_id: number;
  account_id: string;
  display_name: string | null;
  external_url: string | null;
  href: string | null;
  image_url: string | null;
  uri: string | null;
}

// * Class extensions

export class RateLimitError extends Error {
  retryAfter: number;
  constructor(retryAfter: number) {
    super("Spotify rate limit exceeded");
    this.retryAfter = retryAfter;
    this.name = "RateLimitError";
  }
}

// * Frontend HTTP bodies

export interface LoginBody {
  email: string;
  password: string;
}
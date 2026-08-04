export type Theme = 'light' | 'dark' | 'system';

export interface User {
    id: number | null; // TODO: maybe not the best idea to make null
    email: string;
}

export interface SpotifyUser {
  display_name: string,
  external_url: string,
  image_url: string
}
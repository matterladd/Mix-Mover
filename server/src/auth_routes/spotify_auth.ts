import express, { Router } from "express";
import "express-session"; // include for types
import { SpotifyInitToken, Token } from "../types/index.js";
import { addTokensForUser } from "../db/queries.js";

// * check if env variables exist
if (!process.env.SPOTIFY_CLIENT_ID)
  throw new Error("SPOTIFY_CLIENT_ID environment variable not set.");
if (!process.env.SPOTIFY_CLIENT_SECRET)
  throw new Error("SPOTIFY_CLIENT_SECRET environment variable not set.");
if (!process.env.SPOTIFY_ACCOUNTS_URL)
  throw new Error("SPOTIFY_ACCOUNTS_URL environment variable not set.");
if (!process.env.SPOTIFY_REDIRECT_URI)
  throw new Error("SPOTIFY_REDIRECT_URI environment variable not set.");
if (!process.env.FRONTEND_IP)
  throw new Error("FRONTEND_IP environment variable not set.");
if (!process.env.FRONTEND_PORT)
  throw new Error("FRONTEND_PORT environment variable not set.");

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const accounts_url = process.env.SPOTIFY_ACCOUNTS_URL;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;
const frontend_ip = process.env.FRONTEND_IP;
const frontend_port = process.env.FRONTEND_PORT;
const spotify_auth_routes = Router();

spotify_auth_routes.use(express.json());

/**
 * Begin first-time authorization with the OAuth Authorization Code Flow
 */
spotify_auth_routes.get("/", (req, res) => {
  // TODO Fix user_id typing
  const state = String(req.session.user_id); // Use the state to encode the user id which goes around the strict cookies // TODO: is this safe?
  const scope =
    "user-read-private user-read-email playlist-modify-public playlist-modify-private"; // all scopes needed for app
  const query_params = new URLSearchParams({
    client_id: client_id,
    response_type: "code",
    redirect_uri: redirect_uri,
    state: state,
    scope: scope,
  });
  res.redirect(`${accounts_url}/authorize?${query_params.toString()}`);
});

/**
 * Endpoint for OAuth callback providing an authorization code.
 * Gets a new access token + refresh token and writes to database
 */
spotify_auth_routes.get("/callback", async (req, res) => {
  const auth_code = req.query.code as string; // TODO: Kinda lying here
  const state = req.query.state as string;
  if (state != "1") throw new Error(`state does not match, state ${state}`); // TODO: fix hardcoded
  const response = await fetch(`${accounts_url}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(client_id + ":" + client_secret).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: auth_code,
      redirect_uri: redirect_uri,
    }),
  });
  if (!response.ok)
    throw new Error(`unable to get api token, status ${response.status}`);
  const data = (await response.json()) as SpotifyInitToken;
  const token_obj: Token = {
    user_id: Number(state),
    service: "spotify",
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_in, // TODO: inacurrate (at != in)
  };
  addTokensForUser(token_obj);
  res.redirect(`http://${frontend_ip}:${frontend_port}/account?spotify_connected=true`);
});

export default spotify_auth_routes;

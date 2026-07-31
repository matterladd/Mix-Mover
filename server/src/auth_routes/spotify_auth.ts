import env from "../config/env.js";
import express, { Router } from "express";
import "express-session"; // include for types
import { SpotifyInitToken, Token } from "../types/index.js";
import { addTokensForUser } from "../db/queries.js";

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
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: env.SPOTIFY_REDIRECT_URI,
    state: state,
    scope: scope,
  });
  res.redirect(
    `${env.SPOTIFY_ACCOUNTS_URL}/authorize?${query_params.toString()}`,
  );
});

/**
 * Endpoint for OAuth callback providing an authorization code.
 * Gets a new access token + refresh token and writes to database
 */
spotify_auth_routes.get("/callback", async (req, res) => {
  const auth_code = req.query.code as string; // TODO: Kinda lying here
  const state = req.query.state as string;
  if (state != "1") throw new Error(`state does not match, state ${state}`); // TODO: fix hardcoded
  const response = await fetch(`${env.SPOTIFY_ACCOUNTS_URL}/api/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(env.SPOTIFY_CLIENT_ID + ":" + env.SPOTIFY_CLIENT_SECRET).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: auth_code,
      redirect_uri: env.SPOTIFY_REDIRECT_URI,
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
  res.redirect(
    `http://${env.FRONTEND_URL}/account?spotify_connected=true`,
  );
});

export default spotify_auth_routes;

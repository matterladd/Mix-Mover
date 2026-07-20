import "./db/schema.js"; // runs once to initialize db
import db from "./db/client.js";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import SqliteStore from "better-sqlite3-session-store";
import path from "node:path";
import app_auth_routes from "./auth_routes/app_auth.js";
import app_api_routes from "./api_routes/app_api.js";
import spotify_auth_routes from "./auth_routes/spotify_auth.js";
import spotify_api_routes from "./api_routes/spotify_api.js";

// * Check if env variables exist
if (!process.env.EXPRESS_SESSION_SECRET)
  throw new Error("EXPRESS_SESSION_SECRET environment variable not set.");
if (!process.env.EXPRESS_IP)
  throw new Error("EXPRESS_IP environment variable not set.");
if (!process.env.EXPRESS_PORT)
  throw new Error("EXPRESS_PORT environment variable not set.");

const session_secret = process.env.EXPRESS_SESSION_SECRET;
const ip = process.env.EXPRESS_IP;
const port = Number(process.env.EXPRESS_PORT);

// * Setup app and session store instances
const app = express();
const SqliteStoreInstance = SqliteStore(session);

// NOTE: app does not currently use any parsing middleware such as express.json()
// * Setup the routes
app.use(
  session({
    store: new SqliteStoreInstance({
      client: db,
      expired: {
        clear: true,
        intervalMs: 900000, // clear expired sessions every 15 minutes (global timer)
      },
    }),
    secret: session_secret,
    cookie: {
      httpOnly: true, // prevents JS access to cookie (security)
      secure: false, // TODO edit to true in prod (need HTTPS)
      sameSite: "strict",
    },
    resave: false,
    saveUninitialized: false,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello world! This is the root of the backend");
});

// * Note that we use `/api` for every backend route!
app.use("/api/auth", app_auth_routes); // mount app auth routes
app.use("/api/app", app_api_routes); // mount app api routes
app.use("/api/spotify_auth", spotify_auth_routes); // mount spotify auth routes
app.use("/api/spotify", spotify_api_routes); // mount apotify api routes

// * Catch-all
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve("", "../client/index.html"));
});

// * Custom Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) next(err);
  res.status(500).json({ message: err.message });
});

const server = app.listen(port, ip, () => {
  console.log(`App listening on ${ip}:${port}`);
});

server.on("error", (err) => {
  console.error("Sever failed to start:", err);
});

import env from "./config/env.js";
import "./db/schema.js"; // runs once to initialize db
import db from "./db/client.js";
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import SqliteStore from "better-sqlite3-session-store";
import path from "node:path";
import { fileURLToPath } from "node:url";
import app_auth_routes from "./auth_routes/app_auth.js";
import app_api_routes from "./api_routes/app_api.js";
import spotify_auth_routes from "./auth_routes/spotify_auth.js";
import spotify_api_routes from "./api_routes/spotify_api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
    secret: env.EXPRESS_SESSION_SECRET,
    cookie: {
      httpOnly: true, // prevents JS access to cookie (security)
      secure: false,
      sameSite: "strict",
    },
    resave: false,
    saveUninitialized: false,
  }),
);

// * Note that we use `/api` for every backend route!
app.use("/api/auth", app_auth_routes); // mount app auth routes
app.use("/api/app", app_api_routes); // mount app api routes
app.use("/api/spotify_auth", spotify_auth_routes); // mount spotify auth routes
app.use("/api/spotify", spotify_api_routes); // mount apotify api routes

// * Serve built frontend assets
app.use(express.static(path.resolve(__dirname, "../../client/dist")));

// * Catch-all
app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve(__dirname, "../../client/dist/index.html"));
});

// * Custom Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) next(err);
  res.status(500).json({ message: err.message });
});

const server = app.listen(Number(env.EXPRESS_PORT), env.EXPRESS_IP, () => {
  console.log(`App listening on ${env.EXPRESS_IP}:${env.EXPRESS_PORT}`);
});

server.on("error", (err) => {
  console.error("Sever failed to start:", err);
});

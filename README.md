# Mix Mover
### For when your friend keeps sending you those dang Apple Music links
**Mix Mover** is a web app that converts a music playlist from one service to another. I built this project to showcase my full-stack development skills as well as personal use and the use of anyone looking for such a tool.

### Installation
This project is organized into three `npm` project domains: the *client*, *server*, and the *overall/top-level*. Running top-level runs the whole application, while running only the client or server will run that part of the stack. To install:
1. Clone this repository
2. Be sure you have `Node.js` and `npm` installed
3. Run `npm install` in the root of the project, `./client`, and `./server` to install all three `npm` project domains
4. Run the full app with `npm run dev` at project root, or to run only frontend or backend, `npm run dev` at `./client` and `./server` respectively

### Deployment
- TODO

### File Structure
#### `./client`
- TODO
#### `./server`
- `src`
    - `api_routes`: Contains *Express* routes that are responsible for handling requests geared towards a certain API.
    - `services`: Helper functions that may interact directly with an external API. Used in various *Express* routes.
    - `auth_routes`: *Express* routes that handle user authentication.
    - `db`: Contains external database connection, queries, and database setup/creation.

### List of `npm` dependencies and their purpose:
#### Client
- `react` -> Frontend library
- `react-router-dom` -> Provides client-side routing, which allows this project to be a [single page application](https://en.wikipedia.org/wiki/Single-page_application)
- `vite` -> Frontend development server
- `tailwindcss` -> Custom CSS class library
- `shadcn` -> Pre-styled React components using the [BaseUI](https://base-ui.com/) library

#### Server
- `express` -> Backend API routing framework
- `express-session` -> Express middleware extension to store active session information
- `better-sqlite3` -> Node integration with a SQLite database
- `better-sqlite3-session-store` -> Stores user data across different sessions by integrating with `express-session`
- `bcrypt` -> Hashing algorithm used to securely store passwords
- `playwright` -> Headless browser library that is used for web scraping certain sites for playlist data
- `tsx` -> Development tool for running backend without needing to build
- `nodemon` -> Development tool for hot-reloading the backend server
- `bottleneck` -> Handles API rate limiting for outside API requests

#### Project
- `concurrently` -> runs multiple commands concurrently. Used to run client and server at the same time.

### Docs
- Backend Routes:
    - `/api`: Root of all backend services.
    - `/api/auth`: Contains all routes having to do with MixMover account authorization.
    - `/api/spotify_auth`: Contains all routes having to do with Spotify account authorization.
    - `/api/app`: Contains all routes that concern MixMover data.
    - `/api/spotify`: Contains all routes that concern Spotify data. Where most of the Spotify API calls live.
- Backend errors will return `{ error: "message" }` to the frontend.

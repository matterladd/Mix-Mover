# Playlist Converter
### For when your friend keeps sending you those dang Apple Music links

This project is organized into three `npm` domains: the **Client**, **Server**, and **overall/top-level**. Running top-level runs the whole application, while running only the client or server will run that part of the stack.

List of `npm` dependencies and their purpose:
#### Client
- `typescript`
- `vite`

#### Server
- `express` -> Web routing framework
- `express-session` -> Express middleware extension to store active session information
- `better-sqlite3` -> Stores user data across different sessions
- `tsx` -> used to execute TypeScript code directly (not related to a`.tsx` file)
- `nodemon` -> development tool for hot-reloading the backend server

#### Project
- `concurrently` -> runs multiple commands concurrently. Used to run client and server at the same time.
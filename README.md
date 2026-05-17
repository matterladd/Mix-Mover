# Playlist Converter
### For when your friend keeps sending you those dang Apple Music links

This project is organized into three `npm` domains: the **Client**, **Server**, and **overall/top-level**. Running top-level runs the whole application, while running only the client or server will run that part of the stack.

List of `npm` dependencies and their purpose:
#### Client
- `typescript`
- `vite`

#### Server
- `express`
- `express-session`
- `sqlite3`
- `tsx` -> used to execute TypeScript code directly (completely different from a`.tsx` file)

#### Project
- `concurrently` -> runs multiple commands concurrently. Used to run client and server at the same time.
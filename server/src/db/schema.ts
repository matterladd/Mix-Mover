import db from "./client.js";

// uses `exec` instead of `prepare` because this code is only run once
db.exec(`
    CREATE TABLE IF NOT EXISTS users ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS tokens ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        service TEXT NOT NULL,
        access_token TEXT NOT NULL,
        refresh_token TEXT,
        expires_at DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        UNIQUE (user_id, service)
    );

    CREATE TABLE IF NOT EXISTS playlists ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        source_service TEXT NOT NULL,
        target_service TEXT,
        source_id TEXT NOT NULL,
        target_id TEXT,
        source_url TEXT NOT NULL,
        target_url TEXT,
        name TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spotify_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        account_id TEXT NOT NULL,
        display_name TEXT,
        external_url TEXT,
        href TEXT,
        image_url TEXT,
        uri TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS spotify_search_cache (
        query_hash TEXT PRIMARY KEY,
        query TEXT,
        response_json TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

`);

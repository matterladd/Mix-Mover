import Database from "better-sqlite3";

const db = new Database("/app/server/data/database.db"); // creates db file if one does not exist
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export default db;

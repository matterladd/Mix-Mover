import Database from "better-sqlite3";
import env from "../config/env.js";

const db = new Database(env.DB_LOCATION); // creates db file if one does not exist
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

export default db;

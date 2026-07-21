// to satiate the TS gods (fixes implicit type error)

/**
 * This tells TypeScript that 'better-sqlite3-session-store'
 * has some types and that it exports some things with these
 * types. For this module explicitly, this code says that
 * the module exports a function that takes in a 'session' of
 * type 'Store' from express-session, and returns a function
 * that takes in SqliteStoreOptions and returns a Store.
 * In other words, the factory function returns a custom
 * constructor for a Store.
 */
declare module "better-sqlite3-session-store" {
  import { Store } from "express-session";
  import type Database from "better-sqlite3";

  interface SqliteStoreOptions {
    client: Database.Database;
    expired?: {
      clear?: boolean;
      intervalMs?: number;
    };
  }

  function SqliteStoreFactory(session: {
    Store: typeof Store;
  }): new (options: SqliteStoreOptions) => Store;

  export default SqliteStoreFactory;
}

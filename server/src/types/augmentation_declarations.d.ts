export {}; // does nothing except make this a module file.
// module files merge these type modules with the existing ones in the package.json
// instead of the normal overwrite behavior of the default global script file.

declare module "express-session" {
  // types for custom session data
  interface SessionData {
    user_id: number;
  }
}

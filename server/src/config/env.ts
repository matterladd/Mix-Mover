function requireEnv(...names: string[]) {
  const missing = names.filter((name) => !process.env[name]); // uses bracket notation instead of the usual dot notation
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`, // joins all entries into one string, separated each by ", "
    );
  }
  return Object.fromEntries(names.map((name) => [name, process.env[name]])); // takes an array of pairs and converts them to a JS object
}

const env = requireEnv(
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "SPOTIFY_ACCOUNTS_URL",
  "SPOTIFY_API_URL",
  "SPOTIFY_REDIRECT_URI",
);

export default env;
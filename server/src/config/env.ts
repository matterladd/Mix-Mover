function requireEnv(...names: string[]) {
  const result: Record<string, string> = {};
  const missing = [];

  // 'of' for values of an iterable, 'in' for property keys of iterable.
  // in this case 'in' would give us the indexes of the array.
  for (const name of names) {
    const value = process.env[name];
    if (!value) {
      missing.push(name);
    } else {
      result[name] = value;
    }
  }
  if (missing.length > 0)
    throw new Error(`Missing environment variables: ${missing.join(", ")}`);
  return result;
}

const env = requireEnv(
  "SPOTIFY_CLIENT_ID",
  "SPOTIFY_CLIENT_SECRET",
  "SPOTIFY_ACCOUNTS_URL",
  "SPOTIFY_API_URL",
  "SPOTIFY_REDIRECT_URI",
  "DB_LOCATION",
  "FRONTEND_URL",
  "EXPRESS_IP",
  "EXPRESS_PORT",
  "EXPRESS_SESSION_SECRET",
);

export default env;

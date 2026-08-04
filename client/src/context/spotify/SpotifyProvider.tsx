import { useEffect, useState } from "react";
import type { SpotifyUser } from "@/types";
import { SpotifyContext } from "./SpotifyContext";

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);

  const updateSpotifyUser = () => {
    fetch("/api/spotify/me", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: SpotifyUser) => {
        if (data) {
          setSpotifyUser({
            display_name: data.display_name,
            external_url: data.external_url,
            image_url: data.image_url,
          });
        }
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    updateSpotifyUser();
  }, []);

  return (
    <SpotifyContext value={{ spotifyUser, setSpotifyUser, updateSpotifyUser }}>
      {children}
    </SpotifyContext>
  );
}

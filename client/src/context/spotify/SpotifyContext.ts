import { createContext, useContext } from "react";
import type { SpotifyUser } from "@/types";

interface SpotifyContextType {
  spotifyUser: SpotifyUser | null;
  setSpotifyUser: (spotifyUser: SpotifyUser | null) => void;
  updateSpotifyUser: () => void;
}

export const SpotifyContext = createContext<SpotifyContextType>({
  spotifyUser: null,
  setSpotifyUser: () => null,
  updateSpotifyUser: () => null,
});

export const useSpotifyContext = () => useContext(SpotifyContext);

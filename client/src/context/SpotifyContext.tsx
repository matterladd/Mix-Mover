import { createContext, useContext, useState } from 'react';
import type { SpotifyUser } from '../types'

interface SpotifyContextType {
     spotifyUser: SpotifyUser | null,
     setSpotifyUser: (spotifyUser: SpotifyUser | null) => void;
     updateSpotifyUser: () => void;
}

const SpotifyContext = createContext<SpotifyContextType>({
    spotifyUser: null,
    setSpotifyUser: () => null,
    updateSpotifyUser: () => null,
}); 

export function SpotifyProvider({ children }: { children: React.ReactNode}) {
  const [spotifyUser, setSpotifyUser] = useState<SpotifyUser | null>(null);

  const updateSpotifyUser = () => {
    console.log('boobs')
    fetch('/api/spotify/me', {
      method: 'GET',
      credentials: 'include'
    })
    .then(res => res.ok ? res.json() : null)
    .then((data: SpotifyUser) => {
      if (data) {
        setSpotifyUser({
          display_name: data.display_name,
          external_url: data.external_url,
          image_url: data.image_url
        });
      }
    })
    .catch(err => console.error(err));
  }

  return (
    <SpotifyContext value={{spotifyUser, setSpotifyUser, updateSpotifyUser}}>
      {children}
    </SpotifyContext>
  );
}

export const useSpotifyContext = () => useContext(SpotifyContext);
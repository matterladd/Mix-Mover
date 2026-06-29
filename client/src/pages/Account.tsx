import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";

interface SpotifyUser {
  display_name: string,
  external_url: string,
  image_url: string
}

export default function Account() {
    const { user, setUser } = useAuthContext();
    const [spotifyAccount, setSpotifyAccount] = useState<SpotifyUser | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
      if (user) {
        try {
          fetch('/api/spotify/me', {
            method: 'GET',
            credentials: 'include'
          })
          .then(res => res.ok ? res.json() : null)
          .then((data: SpotifyUser) => {
            if (data) {
              setSpotifyAccount({
                display_name: data.display_name,
                external_url: data.external_url,
                image_url: data.image_url
              });
            }
          })
        } catch (err) {
          console.error(err);
        }
      }
    }, [user]);

    function connectSpotifyAccount() {
      window.location.assign('/api/spotify_auth');
    }

    function connectAppleMusicAccount() {
        alert('feature removed');
    }
        
    async function handleLogout() {
        try {
            const res = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
            if (!res.ok) throw new Error('logout failed, status ' + res.status);
            setUser(null);
            setSpotifyAccount(null);
            navigate('/');
        } catch (err) {
            console.error(err);
        }
    }

    function GuestView() {
      return (
        <div className="flex w-full justify-center">
          <div className="flex flex-col w-full max-w-md items-center">
            <p className="font-extrabold text-4xl">not logged in</p>
          </div>
        </div>
      );
    }

    function AccountView() {
      return (
        <div className="flex w-full justify-center">
          <div className="flex flex-col w-full max-w-md items-center">
            <h1 className="text-5xl font-bold pb-4">
              Account
            </h1>
            <h3 className="text-2xl font-semibold pb-4">
              {user!.email}
            </h3>
            <div className="flex pb-4">
              <Button className="max-w-fit" variant="destructive" onClick={handleLogout}>Logout</Button>
              <Button className="max-w-fit" variant="destructive" onClick={() => alert('not implemented')}>Delete Account</Button>
            </div>
            <div className="pb-2">
              <ItemGroup>
                <Item variant="outline">
                  {spotifyAccount && 
                    <ItemMedia variant="image">
                      <a href={spotifyAccount?.external_url}>
                        <img
                          src={spotifyAccount?.image_url}
                          alt='Profile'
                          width={32}
                          height={32}
                          className="object-cover"
                        />
                      </a>
                    </ItemMedia>
                  }
                  <ItemContent>
                    <ItemTitle>Spotify Account</ItemTitle>
                    <ItemDescription>
                      <a target="_blank" href={spotifyAccount?.external_url}>{spotifyAccount?.display_name}</a>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {!spotifyAccount && <Button onClick={connectSpotifyAccount}>connect account</Button>}
                  </ItemActions>
                </Item>
                <Item variant="outline">
                  <ItemContent>
                    <ItemTitle>Apple Music Account</ItemTitle>
                    <ItemDescription>None</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button onClick={connectAppleMusicAccount}>connect account</Button>
                  </ItemActions>
                </Item>
              </ItemGroup>
            </div>
          </div>
        </div>
      );
    }
    
    /**
     * Conditional display
     */
    if (!user) return <GuestView />;
    return <AccountView />;
}
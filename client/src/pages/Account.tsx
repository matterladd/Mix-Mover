import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/auth/index";
import { useNavigate } from "react-router-dom";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSpotifyContext } from "@/context/spotify/index";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

function AccountView() {
  const { user, setUser } = useAuthContext();
  const { spotifyUser, setSpotifyUser } = useSpotifyContext();
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  function connectSpotifyAccount() {
    window.location.assign("/api/spotify_auth");
  }

  async function handleLogout() {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        toast.error(`Error logging out`, {
          position: "top-right",
        });
        throw new Error("logout failed, status " + res.status);
      }
      setUser(null);
      setPassword("");
      setSpotifyUser(null);
      navigate("/");
      toast.success(`Successfully logged out!`, {
        position: "top-right",
        duration: 1500,
      });
    } catch (err) {
      console.error(err);
      toast.error(`Network failure`, {
        position: "top-right",
      });
    }
  }

  async function handleDeleteAccount(e: React.SubmitEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/delete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password }),
      });
      if (!res.ok) {
        toast.error(`Error deleting account`, {
          position: "top-right",
        });
        throw new Error("account deletion failed, status " + res.status);
      }
      setUser(null);
      setSpotifyUser(null);
      navigate("/");
      toast.success(`Account successfully deleted`, {
        position: "top-right",
        duration: 1500,
      });
    } catch (err) {
      console.error(err);
      toast.error(`Network failure`, {
        position: "top-right",
      });
    }
  }

  return (
    <div className="flex w-full justify-center">
      <div className="flex flex-col w-full max-w-md items-center">
        <h1 className="text-5xl font-bold pb-4">Account</h1>
        <h3 className="text-2xl font-semibold pb-4">{user!.email}</h3>
        <div className="flex pb-4">
          <Button
            className="max-w-fit"
            variant="destructive"
            onClick={handleLogout}
          >
            Logout
          </Button>
          <Popover>
            <PopoverTrigger
              render={<Button variant="destructive" className={"max-w-fit"} />}
            >
              Delete Account
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Are you sure?</PopoverTitle>
                <PopoverDescription>Enter your password</PopoverDescription>
              </PopoverHeader>
              <form
                className="flex flex-col md:flex-row justify-center items-center"
                onSubmit={handleDeleteAccount}
              >
                <div className="pr-1">
                  <Input
                    placeholder="password"
                    value={password}
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="pt-2 md:pt-0">
                  <Button type="submit" variant="destructive">
                    delete
                  </Button>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </div>
        <div className="pb-2">
          <ItemGroup>
            <Item variant="outline">
              {spotifyUser && (
                <ItemMedia variant="image">
                  <a href={spotifyUser?.external_url}>
                    <img
                      src={spotifyUser?.image_url}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </a>
                </ItemMedia>
              )}
              <ItemContent>
                <ItemTitle>Spotify Account</ItemTitle>
                <ItemDescription>
                  <a target="_blank" href={spotifyUser?.external_url}>
                    {spotifyUser?.display_name}
                  </a>
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {!spotifyUser && (
                  <Button onClick={connectSpotifyAccount}>
                    connect account
                  </Button>
                )}
              </ItemActions>
            </Item>
            <Item variant="outline">
              <ItemContent>
                <ItemTitle>Apple Music Account</ItemTitle>
                <ItemDescription>coming soon!</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button disabled>connect account</Button>
              </ItemActions>
            </Item>
          </ItemGroup>
        </div>
      </div>
    </div>
  );
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

export default function Account() {
  const { user } = useAuthContext();
  const { updateSpotifyUser } = useSpotifyContext();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("spotify_connected") === "true") {
      updateSpotifyUser();
    }
  }, [updateSpotifyUser]);

  /**
   * Conditional display
   */
  if (!user) return <GuestView />;
  return <AccountView />;
}

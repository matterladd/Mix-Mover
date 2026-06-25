import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const { user, setUser } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {

    });

    function createPlaylist() {
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
            <div className="pb-2">Spotify Account: <Button onClick={createPlaylist}>create playlist</Button></div>
            <div>Apple Music Account: <Button onClick={createPlaylist}>create playlist</Button></div>
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
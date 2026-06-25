import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const { user, setUser } = useAuthContext();
    const navigate = useNavigate();

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
      return <p>not logged in</p>
    }

    function AccountView() {
      return (
         <>
          <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          <Button variant="destructive" onClick={() => alert('not implemented')}>Delete Account</Button>
          <ul>
            <li>Spotify Account: <Button onClick={createPlaylist}>create playlist</Button></li>
            <li>Apple Music Account: </li>
          </ul>
          <h4>Settings</h4>
        </>
      );

    }
    
    /**
     * Conditional display
     */
    if (!user) return <GuestView />;
    return <AccountView />;
}
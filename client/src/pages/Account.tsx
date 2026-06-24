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

    return (
      <>
        <h3>Account</h3>
        <p>{user!.email}</p><button onClick={handleLogout}>Logout</button>
        <h4>Connected Accounts</h4>
        <ul>
          <li>Spotify Account: <button onClick={createPlaylist}>create playlist</button></li>
          <li>Apple Music Account: </li>
        </ul>
        <h4>Settings</h4>
      </>
    );
}
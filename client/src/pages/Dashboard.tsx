import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const user = useAuthContext();

    async function createPlaylist() {
        try {
            const response = await fetch('/api/spotify/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: 'converter test playlist',
                    description: 'converter test description',
                    public: false
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(`failed to create playlist\nstatus ${response.status}\n${data.error.message}`);
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <>
            <h3>Dashboard</h3>
            <h4>Accounts</h4>
            <ul>
                <li>Spotify Account: <button onClick={createPlaylist}>create playlist</button></li>
                <li>Apple Music Account: </li>
            </ul>
        </>
    );
}
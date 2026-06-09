import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const user = useAuthContext();

    async function createPlaylist() {
        alert('feature removed');
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
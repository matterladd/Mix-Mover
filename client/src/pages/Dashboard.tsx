import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const user = useAuthContext();
    const [appleLink, setAppleLink] = useState("");

    function createPlaylist() {
        alert('feature removed');
    }

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/spotify/convert-apple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ link: appleLink })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(`unsuccessful conversion, status ${response.status}, ${data.error}`);

        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <h3>Dashboard</h3>
            <h4>Convert</h4>
            <form onSubmit={handleSubmit}>
                <label>Apple Music playlist link: </label>
                <input value={appleLink} onChange={(e) => setAppleLink(e.target.value)} />
                <button type="submit">convert</button> {/* type is not necessary here but added for clarity */}
            </form>
            <h4>Accounts</h4>
            <ul>
                <li>Spotify Account: <button onClick={createPlaylist}>create playlist</button></li>
                <li>Apple Music Account: </li>
            </ul>
        </>
    );
}
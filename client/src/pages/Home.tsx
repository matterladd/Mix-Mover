import { useAuthContext } from "../context/AuthContext";
import { useState } from "react";

export default function Home() {
    const { user } = useAuthContext();
    const [appleLink, setAppleLink] = useState("");

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();
        const response = await fetch('/api/spotify/convert-apple', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link: appleLink })
        });

        if (!response.ok){
            const data = await response.json();
            console.error(`unsuccessful conversion, status ${response.status}, ${data.error}`);
        }
    }

    return (
        <>
            <h3>Home</h3>
            <p>Welcome, {user?.email || 'random guy'}!</p>
                        
                        
            <h4>Convert</h4>
            <form onSubmit={handleSubmit}>
                <label>Apple Music playlist link: </label>
                <input value={appleLink} onChange={(e) => setAppleLink(e.target.value)} />
                <button type="submit">convert</button> {/* type is not necessary here but added for clarity */}
            </form>
        </>
    );
}
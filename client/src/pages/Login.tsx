import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // TODO: probably unsafe storing this as a state?
    const [isLoggedIn, setIsLoggedIn] = useState(true); // set for first time display
    
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); // stops the default form submit behavior (sending http)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // tells browser to send/receive cookies
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error(`login failed, status: ${res.status}`);

            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setIsLoggedIn(false);
        }
    }

    return (
        <>
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                {!isLoggedIn && <p>Sorry, try again!</p>} 
                <label>email: </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>password: </label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button> {/* type is not necessary here but added for clarity */}
            </form>
        </>
    );
}
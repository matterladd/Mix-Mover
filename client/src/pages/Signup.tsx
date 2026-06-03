import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // TODO: probably unsafe storing this as a state?
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); // stops the default form submit behavior (sending http)

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // tells browser to send/receive cookies
                body: JSON.stringify({ email, password })
            });
            if (!res.ok) throw new Error(`signup failed, status: ${res.status}`);
        } catch (err) {
            console.error(err);
            return; // if failed, stop execution here
        }
        navigate('/dashboard');
    }

    return (
        <>
            <h3>Sign up</h3>
            <form onSubmit={handleSubmit}>
                <label>new user email: </label>
                <input value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>new user password: </label>
                <input value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Sign up</button> {/* type is not necessary here but added for clarity */}
            </form>
        </>
    );
}
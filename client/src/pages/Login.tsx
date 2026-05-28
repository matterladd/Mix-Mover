import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true); // set for first time display
    
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); // stops the default form submit behavior (sending http)

        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // tells browser to send/receive cookies
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            navigate('/Dashboard');
        } else {
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
                <button type="submit">Login</button> {/* type is not necessary here but added for clarity */}
            </form>
        </>
    );
}
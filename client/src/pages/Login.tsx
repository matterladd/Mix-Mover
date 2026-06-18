import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/context/AuthContext";
import { LoginForm } from "@/components/login-form";

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState(""); // TODO: probably unsafe storing this as a state?
    const [isLoggedIn, setIsLoggedIn] = useState(true); // set for first time display
    const { setUser } = useAuthContext();
    
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); // stops the default form submit behavior (sending http)

        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', // tells browser to send/receive cookies
            body: JSON.stringify({ email, password })
        });
        if (!res.ok) {
            const data = await res.json();
            console.error(data.error);
            setIsLoggedIn(false);
        } else {
            setUser({id: null, email: email});
            navigate('/');
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
            <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <LoginForm />
                </div>
            </div>
        </>
    );
}
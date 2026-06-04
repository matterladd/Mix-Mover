import { Link, useNavigate} from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';


export default function NavBar() {
    const { user, setUser } = useAuthContext();
    const navigate = useNavigate();

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
            <Link to="/">Home</Link>
            <span> | </span>
            {user === null && <Link to="/login">Login</Link>}
            {user !== null && <button onClick={handleLogout}>Logout</button>}
            <span> | </span>
            <Link to="/signup">Sign up</Link>
            <span> | </span>
            {user !== null && <Link to="dashboard">Dashboard</Link>}
            <span> | </span>
            {user !== null && <p>Logged in as: {user.email}</p>}
        </>
    );
}
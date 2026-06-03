import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';


export default function NavBar() {
    const user = useAuthContext();
    return (
        <>
            <Link to="/">Home</Link>
            <span> | </span>
            <Link to="/login">Login</Link>
            <span> | </span>            
            <Link to="/signup">Sign up</Link>
            <span> | </span>
            {user !== null && <Link to="dashboard">Dashboard</Link>}
        </>
    );
}
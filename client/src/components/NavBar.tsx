import { Link, useNavigate} from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';


export default function NavBar() {
    const { user, setUser } = useAuthContext();
    const navigate = useNavigate();

    return (
        <>
            <Link to="/">Home</Link>
            {user === null && <span> | </span>}
            {user === null && <Link to="/login">Login</Link>}
            {user === null && <span> | </span>}
            {user === null && <Link to="/signup">Sign up</Link>}
            {user !== null && <span> | </span>}
            {user !== null && <Link to="/account">Account</Link>}
        </>
    );
}
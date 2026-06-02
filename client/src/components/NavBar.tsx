import { Link } from 'react-router-dom'


export default function NavBar() {
    return (
        <>
            <Link to="/">Home</Link>
            <span> | </span>
            <Link to="/login">Login</Link>
            <span> | </span>            
            <Link to="/signup">Sign up</Link>
            <span> | </span>
            <a href='/auth'>Authorize your account</a>
            <span> | </span>
            <Link to="dashboard">Dashboard</Link>
        </>
    );
}
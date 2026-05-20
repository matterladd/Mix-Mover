import { Link } from 'react-router-dom'


export default function NavBar() {
    return (
        <>
            <Link to="/">Go to Home</Link>
            <span> </span>
            <Link to="Dashboard">Go to Dashboard</Link>
            <span> </span>
            <Link to="NotFound">Go to NotFound</Link>
        </>
    );
}
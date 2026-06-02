import { useAuthContext } from "../context/AuthContext";

export default function Dashboard() {
    const user = useAuthContext();

    return (
        <>
            <h3>Dashboard</h3>
            <h4>Accounts</h4>
            <ul>
                <li>Spotify Account: </li>
                <li>Apple Music Account: </li>
            </ul>
        </>
    );
}
import { useAuthContext } from "../context/AuthContext";

export default function Home() {
    const user: any = useAuthContext();

    return (
        <>
            <h3>Home</h3>
            <p>Welcome, {user?.email || 'random guy'}!</p>
        </>
    );
}
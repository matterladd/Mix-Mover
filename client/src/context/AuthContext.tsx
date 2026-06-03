import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types'

interface AuthContextType {
     user: User | null,
     setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => {}
}); 

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => { // useEffect callback cannot itself be async but can contain an async function
        const fetchUser = async () => {
            try {
                const res = await fetch('/api/app/me', { credentials: 'include' });
                if (!res.ok) throw new Error(`failed to fetch user, status: ${res.status}`);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext value={{user, setUser}}>
            <p>Logged in: {user?.email || 'no'}</p>
            {children}
        </AuthContext>
    );
}

export const useAuthContext = () => useContext(AuthContext);
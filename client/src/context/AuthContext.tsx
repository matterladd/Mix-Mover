import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types'

const AuthContext = createContext<User | null>(null); // user's info

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const fetchUser = async () => { // TODO: error checking
            try {
                const res = await fetch('/auth/me', { credentials: 'include' });
                if (!res.ok) throw new Error('failed to fetch: status ' + res.status);
                const data = await res.json();
                setUser(data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();
    }, []);

    return (
        <AuthContext value={user}>
            <p>Logged in: {user?.email || 'no'}</p>
            {children}
        </AuthContext>
    );
}

export const useAuthContext = () => useContext(AuthContext);
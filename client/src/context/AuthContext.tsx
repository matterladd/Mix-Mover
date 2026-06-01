import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  id: number;
  email: string;
}

const AuthContext = createContext<User | null>(null); // user's info

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch('/auth/me', { credentials: 'include' });
                if (!res.ok) throw new Error('failed to fetch: status ' + res.status);
                const data = await res.json();
                console.log('data is:' + JSON.stringify(data));
                console.log('res is:' + res.ok);
                setUser(data);
                console.log('user is: ' + user);
            } catch (err) {
                console.error(err);
            }
        };

        fetchUser();

        // fetch('/auth/me', { credentials: 'include' }) // TODO: error checking
        //     .then(res => res.json())
        //     .then(data => setUser(data));
    }, []);

    return (
        <AuthContext value={user}>
            <p>Logged in: {user?.email || 'no'}</p>
            {children}
        </AuthContext>
    );
}

export const useAuthContext = () => useContext(AuthContext);
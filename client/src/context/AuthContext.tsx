import { createContext, useContext, useEffect, useState } from 'react';
import type { User } from '../types'

interface AuthContextType {
     user: User | null,
     setUser: (user: User | null) => void;
     loading: boolean,
    setLoading: (b: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    setUser: () => null,
    loading: true,
    setLoading: () => null
}); 

export function AuthProvider({ children }: { children: React.ReactNode}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      fetch('/api/app/me')
        .then(res => res.ok ? res.json() : null)
        .then(data => {
          setUser(data);
        });
    }, []);

    return (
      <AuthContext value={{user, setUser, loading, setLoading}}>
        {children}
      </AuthContext>
    );
}

export const useAuthContext = () => useContext(AuthContext);
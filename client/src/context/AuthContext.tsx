import { createContext, useContext, useState } from 'react';
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

    return (
        <AuthContext value={{user, setUser}}>
            {children}
        </AuthContext>
    );
}

export const useAuthContext = () => useContext(AuthContext);
import type { User } from "@/types";
import { createContext, useContext } from "react";

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  setLoading: (b: boolean) => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => null,
  loading: true,
  setLoading: () => null,
});

export const useAuthContext = () => useContext(AuthContext);

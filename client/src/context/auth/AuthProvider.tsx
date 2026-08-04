import { useEffect, useState } from "react";
import { AuthContext } from "@/context/auth/AuthContext";
import type { User } from "@/types";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/app/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setUser(data);
      });
  }, []);

  return (
    <AuthContext value={{ user, setUser, loading, setLoading }}>
      {children}
    </AuthContext>
  );
}

import { useEffect, useState } from "react";
import type { Theme } from "@/types";
import { ThemeContext } from "./ThemeContext";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    /* callback function here for initialization. 
    Runs once instead of on every render (defined in useState behavior) */
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  /**
   * Strips theme class from DOM root and recomputes theme whenever theme state is changed
   */
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
      return;
    }
    root.classList.add(theme);
  }, [theme]);

  /**
   * create a custom value that defines the theme state and
   * wraps the setTheme() state function with another function
   * that includes modifying the localStorage of the browser.
   * This is done for consistency. React state should always
   * match the browser storage state.
   */
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeContext {...props} value={value}>
      {children}
    </ThemeContext>
  );
}

import { createContext, useContext, useEffect, useState } from "react";

type Theme = 'light' | 'dark' | 'system';

interface ThemeProviderProps {
  children: React.ReactNode,
  defaultTheme?: Theme,
  storageKey?: string
}

interface ThemeProviderState {
  theme: Theme,
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'vite-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    /* callback function here for initialization. 
    Runs once instead of on every render (defined in useState behavior) */
    () => localStorage.getItem(storageKey) as Theme || defaultTheme 
  );

  /**
   * Strips theme class from DOM root and recomputes theme whenever theme state is changed
   */
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
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
    }
  }

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider');

  return context;
}
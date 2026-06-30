import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.tsx';
import App from './App.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { SpotifyProvider } from './context/SpotifyContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
      <BrowserRouter>
        <AuthProvider>
          <SpotifyProvider>
            <App />
          </SpotifyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);

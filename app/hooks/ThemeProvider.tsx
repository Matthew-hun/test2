import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Theme = 'purple' | 'emerald' | 'yellow';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  initialTheme?: Theme;
  children: ReactNode;
}

export const ThemeProvider = ({ initialTheme = 'purple', children }: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(initialTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const activeTheme = storedTheme ?? initialTheme;
    setThemeState(activeTheme);
    document.documentElement.setAttribute('data-theme', activeTheme);
  }, [initialTheme]);

  const setTheme = (newTheme: Theme) => {
    localStorage.setItem('theme', newTheme);
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

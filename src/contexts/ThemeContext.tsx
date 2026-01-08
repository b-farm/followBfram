import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import colortheme from '../color/colortheme.json';

interface ThemeColors {
  main: string;
  background: string;
  backgroundcard: string;
  navbar1: string;
  navbar2: string;
  text1: string;
  text2: string;
  text3: string;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  useEffect(() => {
    // Check system preference for dark mode
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDarkMode(darkModeMediaQuery.matches);

    // Listen for changes in system theme preference
    const handleChange = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };

    darkModeMediaQuery.addEventListener('change', handleChange);
    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const colors: ThemeColors = {
    main: isDarkMode ? colortheme.main.dark : colortheme.main.light,
    background: isDarkMode ? colortheme.background.dark : colortheme.background.light,
    backgroundcard: isDarkMode ? colortheme.backgroundcard.dark : colortheme.backgroundcard.light,
    navbar1: isDarkMode ? colortheme.navbar1.dark : colortheme.navbar1.light,
    navbar2: isDarkMode ? colortheme.navbar2.dark : colortheme.navbar2.light,
    text1: isDarkMode ? colortheme.text1.dark : colortheme.text1.light,
    text2: isDarkMode ? colortheme.text2.dark : colortheme.text2.light,
    text3: isDarkMode ? colortheme.text3.dark : colortheme.text3.light,
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

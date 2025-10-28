import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../styles/theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('blue'); // default theme

  useEffect(() => {
    const root = window.document.documentElement;
    const selectedTheme = themes[theme];

    for (const [key, value] of Object.entries(selectedTheme)) {
      root.style.setProperty(`--color-${key}`, value);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

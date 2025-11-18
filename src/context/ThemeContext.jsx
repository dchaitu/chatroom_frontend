import React, { createContext, useContext, useState, useEffect } from 'react';
import { themes } from '../styles/theme';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const CustomThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('blue'); // default theme

  useEffect(() => {
    const root = window.document.documentElement;
    const selectedTheme = themes[theme];

    if(!selectedTheme.isGradient) {
      for (const [key, value] of Object.entries(selectedTheme)) {
        if (key !== 'isGradient') {
          root.style.setProperty(`--color-${key}`, value);
        }
      }
    }
    else {
      root.style.setProperty('--color-gradient-from', selectedTheme.gradientFrom);
      root.style.setProperty('--color-gradient-to', selectedTheme.gradientTo);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(Cookies.get("mode") || "light");
  const [username, setUsername] = useState(Cookies.get("username") || null);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    Cookies.set("mode", newTheme);
    document.body.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const storedTheme = Cookies.get("mode");
    if (storedTheme) {
      setTheme(storedTheme);
    }
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme, username, setUsername }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

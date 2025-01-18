import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import BlockGrid from "./components/BlockGrid";
import { lightTheme, darkTheme } from "./theme";

function App() {
  // Laad de thema voorkeur uit localStorage of gebruik systeem voorkeur
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Update localStorage wanneer thema verandert
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Luister naar systeem thema veranderingen
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const saved = localStorage.getItem("darkMode");
      if (saved === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <CssBaseline />
      <BlockGrid isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />
    </ThemeProvider>
  );
}

export default App;

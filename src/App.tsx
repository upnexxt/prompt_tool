import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box, Container, Theme } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BlockGrid from "./components/BlockGrid";
import ThemeSettings from "./components/ThemeSettings";
import Login from "./components/auth/Login";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import {
  lightTheme,
  natureLightTheme,
  sunsetLightTheme,
  oceanLightTheme,
  lavenderLightTheme,
  forestLightTheme,
  autumnLightTheme,
  cherryLightTheme,
  slateLightTheme,
  defaultDarkTheme,
  natureDarkTheme,
  sunsetDarkTheme,
  oceanDarkTheme,
  lavenderDarkTheme,
  forestDarkTheme,
  autumnDarkTheme,
  cherryDarkTheme,
  slateDarkTheme,
  midnightDarkTheme,
  upnexxtLightTheme,
  upnexxtDarkTheme,
} from "./theme";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const darkModeSetting = localStorage.getItem("darkMode");
    if (darkModeSetting !== null) {
      return JSON.parse(darkModeSetting);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("theme") || "default";
  });

  const [isThemeSettingsOpen, setIsThemeSettingsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const darkModeSetting = localStorage.getItem("darkMode");
      if (darkModeSetting === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleThemeToggle = () => {
    setIsDarkMode((prev: boolean) => !prev);
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
  };

  const getTheme = (): Theme => {
    if (isDarkMode) {
      switch (currentTheme) {
        case "upnexxt":
          return upnexxtDarkTheme;
        case "nature":
          return natureDarkTheme;
        case "sunset":
          return sunsetDarkTheme;
        case "ocean":
          return oceanDarkTheme;
        case "lavender":
          return lavenderDarkTheme;
        case "forest":
          return forestDarkTheme;
        case "autumn":
          return autumnDarkTheme;
        case "cherry":
          return cherryDarkTheme;
        case "slate":
          return slateDarkTheme;
        case "midnight":
          return midnightDarkTheme;
        default:
          return defaultDarkTheme;
      }
    } else {
      switch (currentTheme) {
        case "upnexxt":
          return upnexxtLightTheme;
        case "nature":
          return natureLightTheme;
        case "sunset":
          return sunsetLightTheme;
        case "ocean":
          return oceanLightTheme;
        case "lavender":
          return lavenderLightTheme;
        case "forest":
          return forestLightTheme;
        case "autumn":
          return autumnLightTheme;
        case "cherry":
          return cherryLightTheme;
        case "slate":
          return slateLightTheme;
        default:
          return lightTheme;
      }
    }
  };

  const MainContent = () => (
    <Container maxWidth="lg">
      <Box
        sx={{
          width: "100%",
          maxWidth: "400px",
          margin: "10px auto",
          padding: "0 20px",
          display: "flex",
          justifyContent: "center",
          opacity: 0.9
        }}
      >
        <img
          src="/banner.png"
          alt="UpNexxt Banner"
          style={{
            maxWidth: "100%",
            height: "auto",
            filter: "brightness(0.95)"
          }}
        />
      </Box>
      <BlockGrid
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        onThemeSettingsClick={() => setIsThemeSettingsOpen(true)}
      />
      <ThemeSettings
        open={isThemeSettingsOpen}
        onClose={() => setIsThemeSettingsOpen(false)}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
        onThemeChange={handleThemeChange}
        onDarkModeToggle={handleThemeToggle}
      />
    </Container>
  );

  return (
    <AuthProvider>
      <ThemeProvider theme={getTheme()}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainContent />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

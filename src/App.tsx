import { useState, useEffect } from "react";
import { ThemeProvider, CssBaseline, Box, CircularProgress } from "@mui/material";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import BlockGrid from "./components/BlockGrid";
import ThemeSettings from "./components/ThemeSettings";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/SignUp";
import PendingApproval from "./components/auth/PendingApproval";
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

// Protected Route wrapper component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isApproved, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!isApproved) {
    return <Navigate to="/pending-approval" replace />;
  }

  return <>{children}</>;
};

// Main App Content component
const AppContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved || "default";
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

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
  };

  const getTheme = () => {
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

  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <>
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
              </>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
      </Routes>
    </ThemeProvider>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import React, { useState, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  IconButton,
  Box,
  useMediaQuery,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import BlockGrid from "./components/BlockGrid";
import { getTheme } from "./theme";

function App() {
  // Check systeem voorkeur voor donker thema
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Haal opgeslagen thema voorkeur op uit localStorage
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedMode = localStorage.getItem("themeMode");
    return (
      (savedMode as "light" | "dark") || (prefersDarkMode ? "dark" : "light")
    );
  });

  // Update localStorage wanneer thema verandert
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const theme = getTheme(mode);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 1100,
          bgcolor: "background.paper",
          borderRadius: "50%",
          boxShadow: 2,
        }}
      >
        <IconButton onClick={toggleTheme} color="inherit" size="large">
          {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
      <BlockGrid />
    </ThemeProvider>
  );
}

export default App;

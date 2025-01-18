import { createTheme, PaletteMode } from "@mui/material";

export const getTheme = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === "light"
        ? {
            // Licht thema kleuren
            primary: {
              main: "#1976d2",
            },
            background: {
              default: "#f5f5f5",
              paper: "#ffffff",
            },
          }
        : {
            // Donker thema kleuren
            primary: {
              main: "#90caf9",
            },
            background: {
              default: "#121212",
              paper: "#1e1e1e",
            },
          }),
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === "dark" ? "0 0 10px rgba(0,0,0,0.5)" : undefined,
          },
        },
      },
    },
  });

import { createTheme, ThemeOptions } from "@mui/material/styles";

// Gemeenschappelijke thema instellingen
const commonTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 500,
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 500,
        }),
      },
    },
  },
};

// Licht thema
const lightPalette: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb", // Helder blauw
      light: "#60a5fa",
      dark: "#1d4ed8",
    },
    secondary: {
      main: "#4f46e5", // Indigo
    },
    background: {
      default: "#f8fafc", // Zeer licht grijs-blauw
      paper: "#ffffff",
    },
    text: {
      primary: "#1e293b", // Donker blauw-grijs
      secondary: "#64748b", // Medium blauw-grijs
    },
    error: {
      main: "#ef4444", // Helder rood
    },
    success: {
      main: "#22c55e", // Helder groen
    },
    divider: "rgba(0, 0, 0, 0.08)",
  },
};

// Donker thema
const darkPalette: ThemeOptions = {
  palette: {
    mode: "dark",
    primary: {
      main: "#60a5fa", // Lichter blauw voor betere zichtbaarheid
      light: "#93c5fd",
      dark: "#3b82f6",
    },
    secondary: {
      main: "#818cf8", // Lichter indigo
    },
    background: {
      default: "#0f172a", // Donker navy
      paper: "#1e293b", // Donker blauw-grijs
    },
    text: {
      primary: "#f1f5f9", // Zeer licht grijs-blauw
      secondary: "#94a3b8", // Medium grijs-blauw
    },
    error: {
      main: "#f87171", // Zachter rood
    },
    success: {
      main: "#4ade80", // Zachter groen
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
};

export const lightTheme = createTheme({
  ...commonTheme,
  ...lightPalette,
});

export const darkTheme = createTheme({
  ...commonTheme,
  ...darkPalette,
});

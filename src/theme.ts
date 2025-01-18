import { createTheme, ThemeOptions } from "@mui/material/styles";
import type { PaletteMode } from "@mui/material";

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

// Lichte thema varianten
export const lightThemeVariants = {
  default: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#2563eb",
        light: "#60a5fa",
        dark: "#1d4ed8",
      },
      secondary: {
        main: "#4f46e5",
      },
      background: {
        default: "#f8fafc",
        paper: "#ffffff",
      },
      text: {
        primary: "#1e293b",
        secondary: "#64748b",
      },
    },
  },
  nature: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#059669",
        light: "#34d399",
        dark: "#047857",
      },
      secondary: {
        main: "#0d9488",
      },
      background: {
        default: "#f0fdf4",
        paper: "#ffffff",
      },
      text: {
        primary: "#064e3b",
        secondary: "#047857",
      },
    },
  },
  sunset: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#e11d48",
        light: "#fb7185",
        dark: "#be123c",
      },
      secondary: {
        main: "#ea580c",
      },
      background: {
        default: "#fff1f2",
        paper: "#ffffff",
      },
      text: {
        primary: "#881337",
        secondary: "#9f1239",
      },
    },
  },
  ocean: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#0891b2",
        light: "#22d3ee",
        dark: "#0e7490",
      },
      secondary: {
        main: "#0369a1",
      },
      background: {
        default: "#ecfeff",
        paper: "#ffffff",
      },
      text: {
        primary: "#164e63",
        secondary: "#0e7490",
      },
    },
  },
  lavender: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#7c3aed",
        light: "#a78bfa",
        dark: "#6d28d9",
      },
      secondary: {
        main: "#8b5cf6",
      },
      background: {
        default: "#f5f3ff",
        paper: "#ffffff",
      },
      text: {
        primary: "#5b21b6",
        secondary: "#7c3aed",
      },
    },
  },
  forest: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#166534",
        light: "#22c55e",
        dark: "#14532d",
      },
      secondary: {
        main: "#15803d",
      },
      background: {
        default: "#f0fdf4",
        paper: "#ffffff",
      },
      text: {
        primary: "#14532d",
        secondary: "#166534",
      },
    },
  },
  autumn: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#b45309",
        light: "#f59e0b",
        dark: "#92400e",
      },
      secondary: {
        main: "#d97706",
      },
      background: {
        default: "#fffbeb",
        paper: "#ffffff",
      },
      text: {
        primary: "#92400e",
        secondary: "#b45309",
      },
    },
  },
  cherry: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#be123c",
        light: "#fb7185",
        dark: "#9f1239",
      },
      secondary: {
        main: "#e11d48",
      },
      background: {
        default: "#fff1f2",
        paper: "#ffffff",
      },
      text: {
        primary: "#9f1239",
        secondary: "#be123c",
      },
    },
  },
  slate: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#475569",
        light: "#94a3b8",
        dark: "#334155",
      },
      secondary: {
        main: "#64748b",
      },
      background: {
        default: "#f8fafc",
        paper: "#ffffff",
      },
      text: {
        primary: "#334155",
        secondary: "#475569",
      },
    },
  },
  upnexxt: {
    palette: {
      mode: "light" as PaletteMode,
      primary: {
        main: "#2596BE", // Turquoise
        light: "#45B7E5", // Lichtblauw
        dark: "#1B365D", // Donkerblauw
      },
      secondary: {
        main: "#1D7373", // Donkergroen
      },
      background: {
        default: "#f8fafc",
        paper: "#ffffff",
      },
      text: {
        primary: "#1B365D", // Donkerblauw
        secondary: "#1D7373", // Donkergroen
      },
      success: {
        main: "#4BA84B", // Lichtgroen
      },
    },
  },
};

// Donkere thema varianten
export const darkThemeVariants = {
  default: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#60a5fa",
        light: "#93c5fd",
        dark: "#3b82f6",
      },
      secondary: {
        main: "#818cf8",
      },
      background: {
        default: "#0f172a",
        paper: "#1e293b",
      },
      text: {
        primary: "#f1f5f9",
        secondary: "#94a3b8",
      },
    },
  },
  nature: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#34d399",
        light: "#6ee7b7",
        dark: "#059669",
      },
      secondary: {
        main: "#2dd4bf",
      },
      background: {
        default: "#022c22",
        paper: "#064e3b",
      },
      text: {
        primary: "#ecfdf5",
        secondary: "#6ee7b7",
      },
    },
  },
  sunset: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#fb7185",
        light: "#fda4af",
        dark: "#e11d48",
      },
      secondary: {
        main: "#fb923c",
      },
      background: {
        default: "#4c0519",
        paper: "#881337",
      },
      text: {
        primary: "#fff1f2",
        secondary: "#fda4af",
      },
    },
  },
  ocean: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#22d3ee",
        light: "#67e8f9",
        dark: "#0891b2",
      },
      secondary: {
        main: "#38bdf8",
      },
      background: {
        default: "#083344",
        paper: "#164e63",
      },
      text: {
        primary: "#ecfeff",
        secondary: "#67e8f9",
      },
    },
  },
  lavender: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#a78bfa",
        light: "#c4b5fd",
        dark: "#7c3aed",
      },
      secondary: {
        main: "#a855f7",
      },
      background: {
        default: "#2e1065",
        paper: "#4c1d95",
      },
      text: {
        primary: "#f5f3ff",
        secondary: "#c4b5fd",
      },
    },
  },
  forest: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#22c55e",
        light: "#4ade80",
        dark: "#16a34a",
      },
      secondary: {
        main: "#15803d",
      },
      background: {
        default: "#052e16",
        paper: "#14532d",
      },
      text: {
        primary: "#f0fdf4",
        secondary: "#4ade80",
      },
    },
  },
  autumn: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
      },
      secondary: {
        main: "#fb923c",
      },
      background: {
        default: "#451a03",
        paper: "#78350f",
      },
      text: {
        primary: "#fffbeb",
        secondary: "#fbbf24",
      },
    },
  },
  cherry: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#fb7185",
        light: "#fda4af",
        dark: "#e11d48",
      },
      secondary: {
        main: "#f43f5e",
      },
      background: {
        default: "#4c0519",
        paper: "#881337",
      },
      text: {
        primary: "#fff1f2",
        secondary: "#fda4af",
      },
    },
  },
  slate: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#94a3b8",
        light: "#cbd5e1",
        dark: "#64748b",
      },
      secondary: {
        main: "#475569",
      },
      background: {
        default: "#0f172a",
        paper: "#1e293b",
      },
      text: {
        primary: "#f8fafc",
        secondary: "#cbd5e1",
      },
    },
  },
  midnight: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#6366f1",
        light: "#818cf8",
        dark: "#4f46e5",
      },
      secondary: {
        main: "#4338ca",
      },
      background: {
        default: "#1e1b4b",
        paper: "#312e81",
      },
      text: {
        primary: "#eef2ff",
        secondary: "#818cf8",
      },
    },
  },
  upnexxt: {
    palette: {
      mode: "dark" as PaletteMode,
      primary: {
        main: "#45B7E5", // Lichtblauw
        light: "#2596BE", // Turquoise
        dark: "#1B365D", // Donkerblauw
      },
      secondary: {
        main: "#4BA84B", // Lichtgroen
      },
      background: {
        default: "#1B365D", // Donkerblauw
        paper: "#1D7373", // Donkergroen
      },
      text: {
        primary: "#ffffff",
        secondary: "#45B7E5", // Lichtblauw
      },
      success: {
        main: "#4BA84B", // Lichtgroen
      },
    },
  },
};

// Exporteer de thema's
export const lightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.default,
});

export const natureLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.nature,
});

export const sunsetLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.sunset,
});

export const oceanLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.ocean,
});

export const lavenderLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.lavender,
});

export const forestLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.forest,
});

export const autumnLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.autumn,
});

export const cherryLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.cherry,
});

export const slateLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.slate,
});

export const upnexxtLightTheme = createTheme({
  ...commonTheme,
  ...lightThemeVariants.upnexxt,
});

export const darkTheme = createTheme({
  ...commonTheme,
  ...darkPalette,
});

// Exporteer de donkere thema's
export const defaultDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.default,
});

export const natureDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.nature,
});

export const sunsetDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.sunset,
});

export const oceanDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.ocean,
});

export const lavenderDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.lavender,
});

export const forestDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.forest,
});

export const autumnDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.autumn,
});

export const cherryDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.cherry,
});

export const slateDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.slate,
});

export const midnightDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.midnight,
});

export const upnexxtDarkTheme = createTheme({
  ...commonTheme,
  ...darkThemeVariants.upnexxt,
});

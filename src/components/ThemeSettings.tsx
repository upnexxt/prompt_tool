import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Radio,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Divider,
  Tabs,
  Tab,
  SvgIcon,
} from "@mui/material";
import PaletteIcon from "@mui/icons-material/Palette";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import NatureIcon from "@mui/icons-material/Nature";
import WaterIcon from "@mui/icons-material/Water";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import ForestIcon from "@mui/icons-material/Forest";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InvertColorsIcon from "@mui/icons-material/InvertColors";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import BusinessIcon from "@mui/icons-material/Business";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { lightThemeVariants, darkThemeVariants } from "../theme";

interface ThemeSettingsProps {
  open: boolean;
  onClose: () => void;
  currentTheme: string;
  isDarkMode: boolean;
  onThemeChange: (theme: string) => void;
  onDarkModeToggle: () => void;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const themes = [
  {
    id: "upnexxt",
    name: "UpNeXXt",
    icon: <BusinessIcon sx={{ color: "#2596BE" }} />,
  },
  {
    id: "default",
    name: "Standaard",
    icon: <PaletteIcon sx={{ color: "#2563eb" }} />,
  },
  {
    id: "nature",
    name: "Natuur",
    icon: <NatureIcon sx={{ color: "#059669" }} />,
  },
  {
    id: "sunset",
    name: "Zonsondergang",
    icon: <AutoAwesomeIcon sx={{ color: "#e11d48" }} />,
  },
  {
    id: "ocean",
    name: "Oceaan",
    icon: <WaterIcon sx={{ color: "#0891b2" }} />,
  },
  {
    id: "lavender",
    name: "Lavendel",
    icon: <ColorLensIcon sx={{ color: "#7c3aed" }} />,
  },
  {
    id: "forest",
    name: "Bos",
    icon: <ForestIcon sx={{ color: "#166534" }} />,
  },
  {
    id: "autumn",
    name: "Herfst",
    icon: <WbTwilightIcon sx={{ color: "#b45309" }} />,
  },
  {
    id: "cherry",
    name: "Kers",
    icon: <FavoriteIcon sx={{ color: "#be123c" }} />,
  },
  {
    id: "slate",
    name: "Leisteen",
    icon: <InvertColorsIcon sx={{ color: "#475569" }} />,
  },
  {
    id: "midnight",
    name: "Middernacht",
    icon: <DarkModeIcon sx={{ color: "#6366f1" }} />,
  },
];

const fontThemes = [
  {
    id: "modern",
    name: "Modern",
    description: "Inter & Roboto - Strak en professioneel",
    fontFamily: '"Inter", "Roboto", sans-serif',
  },
  {
    id: "classic",
    name: "Klassiek",
    description: "Georgia & Times - Tijdloos en elegant",
    fontFamily: 'Georgia, "Times New Roman", serif',
  },
  {
    id: "code",
    name: "Code",
    description: "JetBrains Mono - Perfect voor code",
    fontFamily: '"JetBrains Mono", monospace',
  },
  {
    id: "playful",
    name: "Speels",
    description: "Quicksand - Modern en vriendelijk",
    fontFamily: '"Quicksand", sans-serif',
  },
];

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function ThemeSettings({
  open,
  onClose,
  currentTheme,
  isDarkMode,
  onThemeChange,
  onDarkModeToggle,
}: ThemeSettingsProps) {
  const [tabValue, setTabValue] = useState(0);
  const getThemeColors = (themeId: string) => {
    const variants = isDarkMode ? darkThemeVariants : lightThemeVariants;
    return variants[themeId as keyof typeof variants]?.palette;
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Thema Instellingen</DialogTitle>
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="thema instellingen tabs"
        centered
        sx={{ borderBottom: 1, borderColor: "divider" }}
      >
        <Tab
          icon={<PaletteIcon />}
          label="Kleuren"
          id="settings-tab-0"
          aria-controls="settings-tabpanel-0"
        />
        <Tab
          icon={<TextFieldsIcon />}
          label="Lettertype"
          id="settings-tab-1"
          aria-controls="settings-tabpanel-1"
        />
      </Tabs>
      <DialogContent>
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={isDarkMode}
                  onChange={onDarkModeToggle}
                  color="primary"
                />
              }
              label="Donkere modus"
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Kies een kleurenschema:
          </Typography>
          <List>
            {themes.map((theme) => {
              const colors = getThemeColors(theme.id);
              if (!colors) return null;

              return (
                <ListItem key={theme.id} disablePadding>
                  <ListItemButton
                    onClick={() => onThemeChange(theme.id)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    <ListItemIcon>{theme.icon}</ListItemIcon>
                    <ListItemText primary={theme.name} />
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        mr: 1,
                      }}
                    >
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: colors.primary.main,
                        }}
                      />
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: colors.secondary.main,
                        }}
                      />
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: colors.background.default,
                          border: 1,
                          borderColor: "divider",
                        }}
                      />
                    </Box>
                    <Radio
                      checked={currentTheme === theme.id}
                      onChange={() => onThemeChange(theme.id)}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <Typography variant="subtitle1" gutterBottom>
            Kies een lettertype stijl:
          </Typography>
          <List>
            {fontThemes.map((font) => (
              <ListItem key={font.id} disablePadding>
                <ListItemButton
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    py: 2,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: font.fontFamily }}
                  >
                    {font.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: font.fontFamily }}
                  >
                    {font.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography
                      variant="body1"
                      sx={{ fontFamily: font.fontFamily }}
                    >
                      AaBbCc 123
                    </Typography>
                  </Box>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </TabPanel>
      </DialogContent>
    </Dialog>
  );
}

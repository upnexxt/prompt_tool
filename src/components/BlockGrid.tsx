import React, { useState, useEffect } from "react";
import {
  Grid,
  Container,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Collapse,
  FormControlLabel,
  Checkbox,
  FormGroup,
  TextField,
  ListSubheader,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  SelectChangeEvent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BlockCard from "./BlockCard";
import AddBlockModal from "./AddBlockModal";
import CategoryManager from "./CategoryManager";
import { supabase } from "../config/supabase";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ClearIcon from "@mui/icons-material/Clear";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import PaletteIcon from "@mui/icons-material/Palette";
import SearchIcon from "@mui/icons-material/Search";
import ClearAllIcon from "@mui/icons-material/ClearAll";

interface Block {
  id: string;
  title: string;
  content: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface BlockGridProps {
  isDarkMode?: boolean;
  onThemeToggle?: () => void;
  onThemeSettingsClick?: () => void;
}

export default function BlockGrid({
  isDarkMode,
  onThemeToggle,
  onThemeSettingsClick,
}: BlockGridProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [isAllSelected, setIsAllSelected] = useState(true);

  // Laad de opgeslagen states uit localStorage of gebruik defaults
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() => {
    const saved = localStorage.getItem("expandedCategories");
    return saved ? JSON.parse(saved) : {};
  });

  const [categoryPreviews, setCategoryPreviews] = useState<
    Record<string, boolean>
  >(() => {
    const saved = localStorage.getItem("categoryPreviews");
    return saved ? JSON.parse(saved) : {};
  });

  // Bij eerste render, initialiseer states als ze nog niet bestaan
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = { ...expandedCategories };
    const initialPreviews: Record<string, boolean> = { ...categoryPreviews };
    let hasChanges = false;

    categories.forEach((category) => {
      if (initialExpanded[category.name] === undefined) {
        initialExpanded[category.name] = false;
        hasChanges = true;
      }
      if (initialPreviews[category.name] === undefined) {
        initialPreviews[category.name] = true;
        hasChanges = true;
      }
    });

    // Voeg "Geen Categorie" toe als die nog niet bestaat
    if (initialExpanded["Geen Categorie"] === undefined) {
      initialExpanded["Geen Categorie"] = false;
      hasChanges = true;
    }
    if (initialPreviews["Geen Categorie"] === undefined) {
      initialPreviews["Geen Categorie"] = true;
      hasChanges = true;
    }

    if (hasChanges) {
      setExpandedCategories(initialExpanded);
      setCategoryPreviews(initialPreviews);
    }
  }, [categories.length]);

  // Update localStorage wanneer states veranderen
  useEffect(() => {
    localStorage.setItem(
      "expandedCategories",
      JSON.stringify(expandedCategories)
    );
  }, [expandedCategories]);

  useEffect(() => {
    localStorage.setItem("categoryPreviews", JSON.stringify(categoryPreviews));
  }, [categoryPreviews]);

  // Ook de geselecteerde categorieën opslaan
  useEffect(() => {
    const savedCategories = localStorage.getItem("selectedCategories");
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories);
      setSelectedCategories(parsedCategories);
      // Controleer of alle categorieën waren geselecteerd
      setIsAllSelected(parsedCategories.length === categories.length);
    } else {
      // Als er geen opgeslagen selectie is, selecteer dan alle categorieën
      setSelectedCategories(categories.map((cat) => cat.id));
      setIsAllSelected(true);
    }
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(
      "selectedCategories",
      JSON.stringify(selectedCategories)
    );
  }, [selectedCategories]);

  const toggleCategory = (categoryName: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleExpandAll = () => {
    const newExpanded: Record<string, boolean> = {};
    Object.keys(groupedBlocks).forEach((categoryName) => {
      newExpanded[categoryName] = true;
    });
    setExpandedCategories(newExpanded);
  };

  const handleCollapseAll = () => {
    const newExpanded: Record<string, boolean> = {};
    Object.keys(groupedBlocks).forEach((categoryName) => {
      newExpanded[categoryName] = false;
    });
    setExpandedCategories(newExpanded);
  };

  const fetchData = async () => {
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from("categories")
        .select("*");

      if (categoriesError) throw categoriesError;
      setCategories(categoriesData || []);

      // Als alle categorieën geselecteerd waren, selecteer dan ook de nieuwe
      if (isAllSelected) {
        setSelectedCategories((categoriesData || []).map((cat) => cat.id));
      }

      const { data: blocksData, error: blocksError } = await supabase
        .from("blocks")
        .select("*");

      if (blocksError) throw blocksError;
      setBlocks(blocksData || []);
    } catch (error) {
      console.error("Fout bij het ophalen van data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedCategories(categories.map((cat) => cat.id));
    setIsAllSelected(true);
  };

  const filteredBlocks = blocks.filter(
    (block) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(block.category_id)
  );

  const sortedBlocks = [...filteredBlocks].sort((a, b) => {
    const categoryA = categories.find((c) => c.id === a.category_id);
    const categoryB = categories.find((c) => c.id === b.category_id);

    const categoryCompare = (categoryA?.name || "").localeCompare(
      categoryB?.name || ""
    );

    if (categoryCompare !== 0) {
      return categoryCompare;
    }

    return a.title.localeCompare(b.title);
  });

  const filteredCategories = categories
    .filter((category) =>
      category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  const groupedBlocks = sortedBlocks.reduce((groups, block) => {
    const category = categories.find((c) => c.id === block.category_id);
    const categoryName = category?.name || "Geen Categorie";

    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }

    groups[categoryName].push(block);
    return groups;
  }, {} as Record<string, typeof blocks>);

  // Sorteer de categorieën voor weergave, met "Geen Categorie" als laatste
  const sortedGroupedBlocks = Object.entries(groupedBlocks).sort((a, b) => {
    if (a[0] === "Geen Categorie") return 1;
    if (b[0] === "Geen Categorie") return -1;
    return a[0].localeCompare(b[0]);
  });

  const toggleCategoryPreview = (categoryName: string) => {
    setCategoryPreviews((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleToggleAllPreviews = () => {
    const allCategories = [...categories.map((c) => c.name), "Geen Categorie"];
    const areAllVisible = allCategories.every((cat) => categoryPreviews[cat]);

    const newPreviews = { ...categoryPreviews };
    allCategories.forEach((cat) => {
      newPreviews[cat] = !areAllVisible;
    });

    setCategoryPreviews(newPreviews);
  };

  const handleDeselectAll = () => {
    setSelectedCategories([]);
    setIsAllSelected(false);
  };

  // Aangepaste useEffect voor het ophalen van categorieën
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("name");

        if (error) throw error;

        if (data) {
          setCategories(data);
          // Als alle categorieën waren geselecteerd, selecteer dan ook de nieuwe
          if (isAllSelected) {
            setSelectedCategories(data.map((cat) => cat.id));
          }
        }
      } catch (error) {
        console.error("Fout bij het ophalen van categorieën:", error);
      }
    };

    fetchCategories();
  }, [isAllSelected]); // Voeg isAllSelected toe aan de dependencies

  const handleCategoryChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    const newSelected = typeof value === "string" ? value.split(",") : value;
    setSelectedCategories(newSelected);
    // Update isAllSelected op basis van de nieuwe selectie
    setIsAllSelected(newSelected.length === categories.length);

    // Sla de nieuwe selectie op in localStorage
    localStorage.setItem("selectedCategories", JSON.stringify(newSelected));
  };

  const handleBlockAdded = async () => {
    // Haal eerst de nieuwe data op
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*");

    if (categoriesError) {
      console.error("Fout bij het ophalen van categorieën:", categoriesError);
      return;
    }

    // Update de categorieën
    setCategories(categoriesData || []);

    // Als alle categorieën geselecteerd waren, update dan de selectie
    if (isAllSelected) {
      const newSelectedCategories = (categoriesData || []).map((cat) => cat.id);
      setSelectedCategories(newSelectedCategories);
      localStorage.setItem(
        "selectedCategories",
        JSON.stringify(newSelectedCategories)
      );
    }

    // Haal de blokken op
    const { data: blocksData, error: blocksError } = await supabase
      .from("blocks")
      .select("*");

    if (blocksError) {
      console.error("Fout bij het ophalen van blokken:", blocksError);
      return;
    }

    setBlocks(blocksData || []);

    // Zorg dat nieuwe categorieën uitgeklapt zijn
    const newExpanded = { ...expandedCategories };
    categoriesData?.forEach((category) => {
      if (newExpanded[category.name] === undefined) {
        newExpanded[category.name] = true; // Nieuwe categorieën uitgeklapt
      }
    });
    setExpandedCategories(newExpanded);
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Categorieën</InputLabel>
              <Select
                multiple
                value={selectedCategories}
                label="Categorieën"
                onChange={(e) =>
                  setSelectedCategories(e.target.value as string[])
                }
                renderValue={(selected) => {
                  const count = selected.length;
                  const total = categories.length;
                  if (count === total) return "Alle categorieën";
                  if (count === 0) return "Geen categorieën";
                  return `${count} ${
                    count === 1 ? "categorie" : "categorieën"
                  }`;
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 400,
                    },
                  },
                }}
              >
                <ListSubheader sx={{ p: 0 }}>
                  <Box sx={{ p: 1, pb: 0 }}>
                    <TextField
                      size="small"
                      fullWidth
                      placeholder="Zoek categorie..."
                      value={categorySearchQuery}
                      onChange={(e) => setCategorySearchQuery(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon fontSize="small" />
                          </InputAdornment>
                        ),
                        endAdornment: categorySearchQuery && (
                          <InputAdornment position="end">
                            <IconButton
                              size="small"
                              onClick={() => setCategorySearchQuery("")}
                            >
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                  <MenuItem
                    onClick={handleDeselectAll}
                    sx={{
                      borderBottom: 0,
                      color: "text.secondary",
                    }}
                  >
                    <ListItemIcon>
                      <ClearAllIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Deselecteer alles</ListItemText>
                  </MenuItem>
                  <MenuItem
                    onClick={handleSelectAll}
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      color: "text.secondary",
                    }}
                  >
                    <ListItemIcon>
                      <CategoryIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Selecteer alles</ListItemText>
                  </MenuItem>
                </ListSubheader>
                {filteredCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Checkbox
                      checked={selectedCategories.includes(category.id)}
                    />
                    <Typography>{category.name}</Typography>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button
              size="small"
              onClick={handleSelectAll}
              variant="outlined"
              sx={{ height: 40 }}
            >
              Alles
            </Button>

            <Tooltip title="Categorieën Beheren">
              <IconButton
                color="primary"
                onClick={() => setIsCategoryManagerOpen(true)}
              >
                <CategoryIcon />
              </IconButton>
            </Tooltip>

            <Box sx={{ borderLeft: 1, borderColor: "divider", pl: 1, ml: 1 }}>
              <Tooltip title="Alles Uitklappen">
                <IconButton size="small" onClick={handleExpandAll}>
                  <ExpandMoreIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Alles Inklappen">
                <IconButton size="small" onClick={handleCollapseAll}>
                  <ExpandLessIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  Object.values(categoryPreviews).every((v) => v)
                    ? "Verberg alle previews"
                    : "Toon alle previews"
                }
              >
                <IconButton size="small" onClick={handleToggleAllPreviews}>
                  {Object.values(categoryPreviews).every((v) => v) ? (
                    <VisibilityOffIcon fontSize="small" />
                  ) : (
                    <VisibilityIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title={isDarkMode ? "Licht thema" : "Donker thema"}>
                <IconButton size="small" onClick={onThemeToggle}>
                  {isDarkMode ? (
                    <Brightness7Icon fontSize="small" />
                  ) : (
                    <Brightness4Icon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Thema instellingen">
                <IconButton size="small" onClick={onThemeSettingsClick}>
                  <PaletteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Nieuw Blok
          </Button>
        </Box>

        <Box>
          {sortedGroupedBlocks.map(([categoryName, categoryBlocks]) => (
            <Box key={categoryName} sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: expandedCategories[categoryName] ? 1 : 0,
                  cursor: "pointer",
                  "&:hover": {
                    "& .MuiIconButton-root": {
                      opacity: 1,
                    },
                  },
                }}
              >
                <IconButton
                  size="small"
                  className="MuiIconButton-root"
                  sx={{
                    mr: 1,
                    opacity: 0.5,
                    transition: "opacity 0.2s",
                  }}
                  onClick={() => toggleCategory(categoryName)}
                >
                  {expandedCategories[categoryName] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </IconButton>
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{
                    mr: 2,
                    fontSize: "1.1rem",
                    flex: 1,
                  }}
                  onClick={() => toggleCategory(categoryName)}
                >
                  {categoryName}
                </Typography>
                <Tooltip
                  title={
                    categoryPreviews[categoryName]
                      ? "Verberg previews"
                      : "Toon previews"
                  }
                  sx={{ opacity: 0.5, "&:hover": { opacity: 1 } }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCategoryPreview(categoryName);
                    }}
                  >
                    {categoryPreviews[categoryName] ? (
                      <VisibilityOffIcon fontSize="small" />
                    ) : (
                      <VisibilityIcon fontSize="small" />
                    )}
                  </IconButton>
                </Tooltip>
              </Box>

              <Collapse in={expandedCategories[categoryName]}>
                <Grid container spacing={2}>
                  {categoryBlocks.map((block) => (
                    <Grid item xs={12} sm={6} md={3} key={block.id}>
                      <BlockCard
                        block={block}
                        category={categories.find(
                          (c) => c.id === block.category_id
                        )}
                        categories={categories}
                        onBlockUpdated={fetchData}
                        showPreview={categoryPreviews[categoryName]}
                      />
                    </Grid>
                  ))}
                </Grid>
              </Collapse>
            </Box>
          ))}
        </Box>

        <AddBlockModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          categories={categories}
          onBlockAdded={handleBlockAdded}
          isDarkMode={isDarkMode}
        />

        <CategoryManager
          open={isCategoryManagerOpen}
          onClose={() => setIsCategoryManagerOpen(false)}
          categories={categories}
          onCategoriesChanged={fetchData}
        />
      </Box>
    </Container>
  );
}

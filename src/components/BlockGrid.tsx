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

export default function BlockGrid() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);

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
        initialExpanded[category.name] = true;
        hasChanges = true;
      }
      if (initialPreviews[category.name] === undefined) {
        initialPreviews[category.name] = true;
        hasChanges = true;
      }
    });

    // Voeg "Geen Categorie" toe als die nog niet bestaat
    if (initialExpanded["Geen Categorie"] === undefined) {
      initialExpanded["Geen Categorie"] = true;
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
    const allCategoryIds = categories.map((cat) => cat.id);
    const savedSelected = localStorage.getItem("selectedCategories");
    if (savedSelected) {
      // Filter out any saved categories that no longer exist
      const validSelected = JSON.parse(savedSelected).filter((id: string) =>
        allCategoryIds.includes(id)
      );
      setSelectedCategories(
        validSelected.length ? validSelected : allCategoryIds
      );
    } else {
      setSelectedCategories(allCategoryIds);
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
    const allCategoryIds = categories.map((cat) => cat.id);
    setSelectedCategories(allCategoryIds);
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

  const groupedBlocks = sortedBlocks.reduce((groups, block) => {
    const category = categories.find((c) => c.id === block.category_id);
    const categoryName = category?.name || "Geen Categorie";

    if (!groups[categoryName]) {
      groups[categoryName] = [];
    }

    groups[categoryName].push(block);
    return groups;
  }, {} as Record<string, typeof blocks>);

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
                  return selected
                    .map(
                      (id) =>
                        categories.find((cat) => cat.id === id)?.name || ""
                    )
                    .filter(Boolean)
                    .join(", ");
                }}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 300,
                    },
                  },
                }}
              >
                {categories.map((category) => (
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
          {Object.entries(groupedBlocks).map(
            ([categoryName, categoryBlocks]) => (
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
            )
          )}
        </Box>

        <AddBlockModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          categories={categories}
          onBlockAdded={fetchData}
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

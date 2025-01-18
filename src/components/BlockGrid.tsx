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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CategoryIcon from "@mui/icons-material/Category";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import BlockCard from "./BlockCard";
import AddBlockModal from "./AddBlockModal";
import CategoryManager from "./CategoryManager";
import { supabase } from "../config/supabase";

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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >({});

  // Bij eerste render, alle categorieën uitklappen
  useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    categories.forEach((category) => {
      initialExpanded[category.name] = true;
    });
    initialExpanded["Geen Categorie"] = true;
    setExpandedCategories(initialExpanded);
  }, [categories.length]);

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

  const filteredBlocks =
    selectedCategory === "all"
      ? blocks
      : blocks.filter((block) => block.category_id === selectedCategory);

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
              <InputLabel>Categorie</InputLabel>
              <Select
                value={selectedCategory}
                label="Categorie"
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">Alle</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
                  onClick={() => toggleCategory(categoryName)}
                >
                  <IconButton
                    size="small"
                    className="MuiIconButton-root"
                    sx={{
                      mr: 1,
                      opacity: 0.5,
                      transition: "opacity 0.2s",
                    }}
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
                    }}
                  >
                    {categoryName}
                  </Typography>
                  <Divider sx={{ flex: 1 }} />
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

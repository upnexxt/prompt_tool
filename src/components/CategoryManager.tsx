import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import { supabase } from "../config/supabase";

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface CategoryManagerProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoriesChanged: () => void;
}

const DEFAULT_COLORS = [
  "#f44336", // Rood
  "#e91e63", // Roze
  "#9c27b0", // Paars
  "#673ab7", // Diep Paars
  "#3f51b5", // Indigo
  "#2196f3", // Blauw
  "#03a9f4", // Licht Blauw
  "#00bcd4", // Cyaan
  "#009688", // Teal
  "#4caf50", // Groen
  "#8bc34a", // Licht Groen
  "#cddc39", // Limoen
  "#ffeb3b", // Geel
  "#ffc107", // Amber
  "#ff9800", // Oranje
  "#ff5722", // Diep Oranje
];

export default function CategoryManager({
  open,
  onClose,
  categories,
  onCategoriesChanged,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState(DEFAULT_COLORS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("categories").insert([
        {
          name: newCategoryName.trim(),
          color: newCategoryColor,
        },
      ]);

      if (error) throw error;

      setNewCategoryName("");
      setNewCategoryColor(DEFAULT_COLORS[0]);
      onCategoriesChanged();
    } catch (error) {
      console.error("Fout bij het toevoegen van categorie:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCategoryColor = async (
    categoryId: string,
    newColor: string
  ) => {
    try {
      console.log("Updating category color:", { categoryId, newColor });

      const { error, data } = await supabase
        .from("categories")
        .update({ color: newColor })
        .eq("id", categoryId)
        .select();

      console.log("Update result:", { error, data });

      if (error) throw error;

      onCategoriesChanged();
      setShowColorPicker(null);
    } catch (error) {
      console.error("Fout bij het bijwerken van categorie kleur:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { data: blocks } = await supabase
        .from("blocks")
        .select("id")
        .eq("category_id", categoryId);

      if (blocks && blocks.length > 0) {
        alert(
          "Deze categorie kan niet worden verwijderd omdat er nog blokken aan gekoppeld zijn."
        );
        return;
      }

      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", categoryId);

      if (error) throw error;

      onCategoriesChanged();
    } catch (error) {
      console.error("Fout bij het verwijderen van categorie:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Categorieën Beheren</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Nieuwe Categorie Toevoegen
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Categorienaam"
              size="small"
              fullWidth
            />
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              {DEFAULT_COLORS.map((color) => (
                <Tooltip key={color} title="Kies deze kleur">
                  <Box
                    onClick={() => setNewCategoryColor(color)}
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: color,
                      borderRadius: 1,
                      cursor: "pointer",
                      border:
                        newCategoryColor === color ? "3px solid black" : "none",
                    }}
                  />
                </Tooltip>
              ))}
            </Box>
            <Button
              variant="contained"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim() || isSubmitting}
            >
              Toevoegen
            </Button>
          </Box>
        </Box>

        <Typography variant="subtitle1" gutterBottom>
          Bestaande Categorieën
        </Typography>
        <List>
          {categories.map((category) => (
            <ListItem
              key={category.id}
              sx={{
                borderLeft: `4px solid ${category.color || "#grey"}`,
                mb: 1,
                bgcolor: "background.paper",
                borderRadius: 1,
              }}
            >
              <ListItemText primary={category.name} />
              <ListItemSecondaryAction>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {showColorPicker === category.id ? (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        flexWrap: "wrap",
                        maxWidth: 200,
                      }}
                    >
                      {DEFAULT_COLORS.map((color) => (
                        <Box
                          key={color}
                          onClick={() =>
                            handleUpdateCategoryColor(category.id, color)
                          }
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: color,
                            borderRadius: 0.5,
                            cursor: "pointer",
                            border:
                              category.color === color
                                ? "2px solid black"
                                : "none",
                          }}
                        />
                      ))}
                    </Box>
                  ) : (
                    <Tooltip title="Kleur aanpassen">
                      <IconButton
                        onClick={() => setShowColorPicker(category.id)}
                        size="small"
                      >
                        <ColorLensIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteCategory(category.id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Sluiten</Button>
      </DialogActions>
    </Dialog>
  );
}

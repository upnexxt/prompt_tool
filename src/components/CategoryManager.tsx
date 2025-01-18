import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../config/supabase";

// Hergebruik dezelfde kleuren als in AddBlockModal
const CATEGORY_COLORS = [
  { name: "Blauw", value: "#2563eb" },
  { name: "Groen", value: "#16a34a" },
  { name: "Rood", value: "#dc2626" },
  { name: "Paars", value: "#9333ea" },
  { name: "Roze", value: "#db2777" },
  { name: "Oranje", value: "#ea580c" },
  { name: "Geel", value: "#ca8a04" },
  { name: "Grijs", value: "#4b5563" },
];

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

export default function CategoryManager({
  open,
  onClose,
  categories,
  onCategoriesChanged,
}: CategoryManagerProps) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#2563eb");
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      const { error } = await supabase.from("categories").insert([
        {
          name: newCategoryName.trim(),
          color: newCategoryColor,
        },
      ]);

      if (error) throw error;

      setNewCategoryName("");
      setNewCategoryColor("#2563eb");
      onCategoriesChanged();
    } catch (error) {
      console.error("Fout bij het toevoegen van categorie:", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
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

  const handleStartEdit = (category: Category) => {
    setEditingCategory(category.id);
    setEditName(category.name);
    setEditColor(category.color || "#2563eb");
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    setEditName("");
    setEditColor("");
  };

  const handleSaveEdit = async (categoryId: string) => {
    if (!editName.trim()) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update({
          name: editName.trim(),
          color: editColor,
        })
        .eq("id", categoryId);

      if (error) throw error;

      handleCancelEdit();
      onCategoriesChanged();
    } catch (error) {
      console.error("Fout bij het bijwerken van categorie:", error);
    }
  };

  // Sorteer categorieën alfabetisch
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Categorieën Beheren</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Nieuwe categorie toevoegen */}
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              sx={{ flex: 1 }}
              label="Nieuwe Categorie"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              size="small"
            />
            <FormControl sx={{ width: 150 }} size="small">
              <InputLabel>Kleur</InputLabel>
              <Select
                value={newCategoryColor}
                label="Kleur"
                onChange={(e) => setNewCategoryColor(e.target.value)}
              >
                {CATEGORY_COLORS.map((color) => (
                  <MenuItem key={color.value} value={color.value}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: color.value,
                        }}
                      />
                      {color.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleAddCategory}
              disabled={!newCategoryName.trim()}
            >
              Toevoegen
            </Button>
          </Box>

          {/* Lijst van bestaande categorieën */}
          <List sx={{ width: "100%" }}>
            {sortedCategories.map((category) => (
              <ListItem
                key={category.id}
                sx={{
                  bgcolor:
                    editingCategory === category.id
                      ? "action.hover"
                      : "transparent",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    width: "100%",
                  }}
                >
                  {editingCategory === category.id ? (
                    <>
                      <TextField
                        size="small"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        sx={{ flex: 1 }}
                      />
                      <FormControl size="small" sx={{ width: 150 }}>
                        <InputLabel>Kleur</InputLabel>
                        <Select
                          value={editColor}
                          label="Kleur"
                          onChange={(e) => setEditColor(e.target.value)}
                        >
                          {CATEGORY_COLORS.map((color) => (
                            <MenuItem key={color.value} value={color.value}>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 16,
                                    height: 16,
                                    borderRadius: "50%",
                                    bgcolor: color.value,
                                  }}
                                />
                                {color.name}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <Box sx={{ display: "flex", gap: 0.5, ml: 1 }}>
                        <Tooltip title="Opslaan">
                          <IconButton
                            onClick={() => handleSaveEdit(category.id)}
                            color="primary"
                            size="small"
                          >
                            <CheckIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Annuleren">
                          <IconButton onClick={handleCancelEdit} size="small">
                            <CloseIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: "50%",
                          bgcolor: category.color || "#2563eb",
                        }}
                      />
                      <ListItemText primary={category.name} sx={{ flex: 1 }} />
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Bewerken">
                          <IconButton
                            onClick={() => handleStartEdit(category)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Verwijderen">
                          <IconButton
                            onClick={() => handleDeleteCategory(category.id)}
                            sx={{
                              "&:hover": {
                                "& .MuiSvgIcon-root": {
                                  color: "error.main",
                                },
                              },
                            }}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Typography,
  Divider,
  Tooltip,
} from "@mui/material";
import { supabase } from "../config/supabase";
import AddIcon from "@mui/icons-material/Add";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

// Vooraf gedefinieerde kleuren
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

interface AddBlockModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onBlockAdded: () => void;
  isDarkMode?: boolean;
}

export default function AddBlockModal({
  open,
  onClose,
  categories,
  onBlockAdded,
  isDarkMode = false,
}: AddBlockModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState("#2563eb"); // Default blauw
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async () => {
    try {
      let selectedCategoryId = categoryId;

      // Als er een nieuwe categorie is ingevuld, maak deze eerst aan
      if (showNewCategory && newCategoryName.trim()) {
        const { data: newCategory, error: categoryError } = await supabase
          .from("categories")
          .insert([
            {
              name: newCategoryName.trim(),
              color: newCategoryColor,
            },
          ])
          .select()
          .single();

        if (categoryError) throw categoryError;
        selectedCategoryId = newCategory.id;
      }

      const { error: blockError } = await supabase.from("blocks").insert([
        {
          title,
          content,
          category_id: selectedCategoryId,
        },
      ]);

      if (blockError) throw blockError;

      onBlockAdded();
      handleClose();
    } catch (error) {
      console.error("Fout bij het toevoegen van block:", error);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setCategoryId("");
    setShowNewCategory(false);
    setNewCategoryName("");
    setNewCategoryColor("#2563eb");
    setShowPreview(false);
    onClose();
  };

  // Sorteer categorieën alfabetisch
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const isValid = () => {
    if (showNewCategory) {
      return title.trim() && content.trim() && newCategoryName.trim();
    }
    return title.trim() && content.trim() && categoryId;
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Nieuw Block Toevoegen</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {/* Categorie Selectie */}
          <Box>
            {!showNewCategory ? (
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <FormControl fullWidth>
                  <InputLabel>Categorie</InputLabel>
                  <Select
                    value={categoryId}
                    label="Categorie"
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    {sortedCategories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Box
                            sx={{
                              width: 16,
                              height: 16,
                              borderRadius: "50%",
                              bgcolor: category.color || "#2563eb",
                            }}
                          />
                          {category.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Tooltip title="Nieuwe categorie toevoegen">
                  <IconButton
                    onClick={() => setShowNewCategory(true)}
                    color="primary"
                    sx={{ mt: 1 }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            ) : (
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <TextField
                  sx={{ flex: 1 }}
                  label="Nieuwe Categorie"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
                <FormControl sx={{ width: 150 }}>
                  <InputLabel>Kleur</InputLabel>
                  <Select
                    value={newCategoryColor}
                    label="Kleur"
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                  >
                    {CATEGORY_COLORS.map((color) => (
                      <MenuItem key={color.value} value={color.value}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
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
                <Tooltip title="Bestaande categorie kiezen">
                  <IconButton
                    onClick={() => {
                      setShowNewCategory(false);
                      setNewCategoryName("");
                      setNewCategoryColor("#2563eb");
                    }}
                    size="small"
                    sx={{ mt: 1 }}
                  >
                    <AddIcon sx={{ transform: "rotate(45deg)" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          </Box>

          {/* Titel */}
          <TextField
            fullWidth
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Content met Preview */}
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Content (Markdown)
              </Typography>
              <Button size="small" onClick={() => setShowPreview(!showPreview)}>
                {showPreview ? "Bewerk" : "Preview"}
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, minHeight: 300 }}>
              <TextField
                fullWidth
                multiline
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{
                  display: showPreview ? "none" : "block",
                  "& .MuiInputBase-root": {
                    fontFamily: "monospace",
                  },
                }}
              />

              {showPreview && (
                <Box
                  sx={{
                    flex: 1,
                    p: 2,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    bgcolor: "background.paper",
                    overflow: "auto",
                  }}
                >
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ node, inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || "");
                        return !inline && match ? (
                          <SyntaxHighlighter
                            style={isDarkMode ? materialDark : materialLight}
                            language={match[1]}
                            PreTag="div"
                            {...props}
                          >
                            {String(children).replace(/\n$/, "")}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuleren</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValid()}
        >
          Toevoegen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

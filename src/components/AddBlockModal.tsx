import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
} from "@mui/material";
import { supabase } from "../config/supabase";
import { formatContent } from "../utils/formatContent";

interface Category {
  id: string;
  name: string;
}

interface AddBlockModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onBlockAdded: () => void;
}

export default function AddBlockModal({
  open,
  onClose,
  categories,
  onBlockAdded,
}: AddBlockModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewContent, setPreviewContent] = useState("");

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    // Update preview met geformatteerde content
    setPreviewContent(formatContent(newContent));
  };

  const handleSubmit = async () => {
    if (!title || !content || !categoryId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("blocks").insert([
        {
          title,
          content: previewContent || formatContent(content), // Gebruik geformatteerde content
          category_id: categoryId,
        },
      ]);

      if (error) throw error;

      onBlockAdded();
      handleClose();
    } catch (error) {
      console.error("Fout bij het toevoegen van blok:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    setCategoryId("");
    setPreviewContent("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Nieuw Blok Toevoegen</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel>Categorie</InputLabel>
            <Select
              value={categoryId}
              label="Categorie"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Content"
            value={content}
            onChange={handleContentChange}
            multiline
            rows={8}
            fullWidth
            placeholder="Plak hier je code of markdown tekst. Het wordt automatisch geformatteerd."
          />

          {previewContent && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview van geformatteerde content:
              </Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: "grey.100",
                  borderRadius: 1,
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  maxHeight: "200px",
                  overflow: "auto",
                }}
              >
                {previewContent}
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Annuleren</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title || !content || !categoryId || isSubmitting}
        >
          Toevoegen
        </Button>
      </DialogActions>
    </Dialog>
  );
}

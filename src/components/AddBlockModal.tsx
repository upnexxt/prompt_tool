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
} from "@mui/material";
import { supabase } from "../config/supabase";

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

  const handleSubmit = async () => {
    if (!title || !content || !categoryId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("blocks").insert([
        {
          title,
          content,
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
            onChange={(e) => setContent(e.target.value)}
            multiline
            rows={8}
            fullWidth
          />
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

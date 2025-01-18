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
} from "@mui/material";
import { supabase } from "../config/supabase";

interface Category {
  id: string;
  name: string;
  color?: string;
}

interface Block {
  id: string;
  title: string;
  content: string;
  category_id: string;
}

interface EditBlockModalProps {
  open: boolean;
  onClose: () => void;
  block: Block;
  categories: Category[];
  onBlockUpdated: () => void;
}

export default function EditBlockModal({
  open,
  onClose,
  block,
  categories,
  onBlockUpdated,
}: EditBlockModalProps) {
  const [title, setTitle] = useState(block.title);
  const [content, setContent] = useState(block.content);
  const [categoryId, setCategoryId] = useState(block.category_id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !content || !categoryId) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("blocks")
        .update({
          title,
          content,
          category_id: categoryId,
        })
        .eq("id", block.id);

      if (error) throw error;

      onBlockUpdated();
      onClose();
    } catch (error) {
      console.error("Fout bij het bijwerken van blok:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Blok Bewerken</DialogTitle>
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
        <Button onClick={onClose}>Annuleren</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!title || !content || !categoryId || isSubmitting}
        >
          Opslaan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

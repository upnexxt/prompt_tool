import React, { useState, useEffect } from "react";
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
  Typography,
} from "@mui/material";
import { supabase } from "../config/supabase";
import { formatContent } from "../utils/formatContent";

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
  const [previewContent, setPreviewContent] = useState("");

  // Reset states wanneer een nieuw block wordt bewerkt
  useEffect(() => {
    setTitle(block.title);
    setContent(block.content);
    setCategoryId(block.category_id);
    setPreviewContent(formatContent(block.content));
  }, [block]);

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
      const { error } = await supabase
        .from("blocks")
        .update({
          title,
          content: previewContent || formatContent(content),
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

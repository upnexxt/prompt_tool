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
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

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

interface EditBlockModalProps {
  open: boolean;
  onClose: () => void;
  block: Block;
  categories: Category[];
  onBlockUpdated: () => void;
  isDarkMode?: boolean;
}

export default function EditBlockModal({
  open,
  onClose,
  block,
  categories,
  onBlockUpdated,
  isDarkMode = false,
}: EditBlockModalProps) {
  const [title, setTitle] = useState(block.title);
  const [content, setContent] = useState(block.content);
  const [categoryId, setCategoryId] = useState(block.category_id);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setTitle(block.title);
    setContent(block.content);
    setCategoryId(block.category_id);
  }, [block]);

  const handleSubmit = async () => {
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
      handleClose();
    } catch (error) {
      console.error("Fout bij het bijwerken van block:", error);
    }
  };

  const handleClose = () => {
    setTitle(block.title);
    setContent(block.content);
    setCategoryId(block.category_id);
    setShowPreview(false);
    onClose();
  };

  // Sorteer categorieën alfabetisch
  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Block Bewerken</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Categorie</InputLabel>
            <Select
              value={categoryId}
              label="Categorie"
              onChange={(e) => setCategoryId(e.target.value)}
            >
              {sortedCategories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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

          <TextField
            fullWidth
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

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
          disabled={!title.trim() || !content.trim() || !categoryId}
        >
          Opslaan
        </Button>
      </DialogActions>
    </Dialog>
  );
}

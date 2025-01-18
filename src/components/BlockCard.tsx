import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  useTheme,
  IconButton,
  Tooltip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { supabase } from "../config/supabase";
import EditBlockModal from "./EditBlockModal";

interface BlockCardProps {
  block: {
    id: string;
    title: string;
    content: string;
    category_id: string;
  };
  category?: {
    name: string;
    color?: string;
  };
  categories: Category[];
  onBlockUpdated: () => void;
}

interface Category {
  id: string;
  name: string;
  color?: string;
}

const CARD_MIN_HEIGHT = 220;
const CONTENT_HEIGHT = 100;

export default function BlockCard({
  block,
  category,
  categories,
  onBlockUpdated,
}: BlockCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.content);
      setIsCopied(true);
      setShowCopiedMessage(true);

      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Fout bij kopiëren:", err);
    }
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("blocks")
        .delete()
        .eq("id", block.id);

      if (error) throw error;

      onBlockUpdated();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Fout bij het verwijderen van blok:", error);
    }
  };

  return (
    <>
      <Card
        sx={{
          height: CARD_MIN_HEIGHT,
          display: "flex",
          flexDirection: "column",
          borderTop: category?.color
            ? `4px solid ${category.color}`
            : undefined,
          bgcolor: "background.paper",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: isDark ? "0 4px 20px rgba(0,0,0,0.5)" : 6,
          },
        }}
      >
        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
              minHeight: 40,
            }}
          >
            <Typography
              variant="h6"
              component="h2"
              sx={{
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {block.title}
            </Typography>
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <Tooltip title="Bewerken">
                <IconButton
                  onClick={() => setIsEditModalOpen(true)}
                  size="small"
                  sx={{
                    color: "primary.main",
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Verwijderen">
                <IconButton
                  onClick={() => setIsDeleteDialogOpen(true)}
                  size="small"
                  sx={{
                    color: "error.main",
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Kopieer inhoud">
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{
                    color: isCopied ? "success.main" : "inherit",
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                    "&:hover": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  {isCopied ? (
                    <CheckIcon fontSize="small" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box
            sx={{
              bgcolor: isDark ? "background.default" : "grey.100",
              p: 1.5,
              borderRadius: 1,
              mb: 2,
              height: CONTENT_HEIGHT,
              overflow: "auto",
              flexGrow: 1,
            }}
          >
            <Typography
              variant="body2"
              component="pre"
              sx={{
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                m: 0,
                height: "100%",
              }}
            >
              {block.content}
            </Typography>
          </Box>

          <Box
            sx={{
              mt: "auto",
              minHeight: 32,
              display: "flex",
              alignItems: "center",
            }}
          >
            {category && (
              <Chip
                label={category.name}
                size="small"
                sx={{
                  bgcolor: category.color || theme.palette.primary.main,
                  color: isDark ? "black" : "white",
                  fontWeight: "medium",
                }}
              />
            )}
          </Box>
        </CardContent>

        <Snackbar
          open={showCopiedMessage}
          autoHideDuration={2000}
          onClose={() => setShowCopiedMessage(false)}
          message="Tekst gekopieerd naar klembord"
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </Card>

      <EditBlockModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        block={block}
        categories={categories}
        onBlockUpdated={onBlockUpdated}
      />

      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Blok Verwijderen</DialogTitle>
        <DialogContent>
          Weet je zeker dat je dit blok wilt verwijderen? Deze actie kan niet
          ongedaan worden gemaakt.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>
            Annuleren
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Verwijderen
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

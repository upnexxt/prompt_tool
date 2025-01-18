import React, { useState, useEffect } from "react";
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
  Modal,
  Fade,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../config/supabase";
import EditBlockModal from "./EditBlockModal";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  materialDark,
  materialLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { styled } from "@mui/material/styles";

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.2s ease-in-out",
  cursor: "pointer",
  "&:hover": {
    transform: "scale(1.02)",
  },
}));

const ContentContainer = styled(Box)(({ theme }) => ({
  maxHeight: "200px",
  overflow: "hidden",
  position: "relative",
  "&::after": {
    content: '""',
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50px",
    background: "linear-gradient(transparent, rgba(255,255,255,0.9))",
  },
}));

const FullscreenModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ModalContent = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[24],
  width: "80%",
  maxWidth: "1000px",
  maxHeight: "80vh",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
}));

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
  showPreview?: boolean;
}

interface Category {
  id: string;
  name: string;
  color?: string;
}

const CARD_MIN_HEIGHT = 300;
const CONTENT_HEIGHT = 180;

export default function BlockCard({
  block,
  category,
  categories,
  onBlockUpdated,
  showPreview = true,
}: BlockCardProps) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [showCopiedMessage, setShowCopiedMessage] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isContentExpanded, setIsContentExpanded] = useState(false);
  const [localShowPreview, setLocalShowPreview] = useState(showPreview);

  useEffect(() => {
    setLocalShowPreview(showPreview);
  }, [showPreview]);

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

  // Functie om code blocks te renderen binnen Markdown
  const CodeBlock = ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || "");
    const isDark = theme.palette.mode === "dark";

    return !inline && match ? (
      <SyntaxHighlighter
        style={isDark ? materialDark : materialLight}
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
  };

  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsContentExpanded(true);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalShowPreview(!localShowPreview);
  };

  return (
    <>
      <Card
        onClick={handleCardClick}
        sx={{
          height: localShowPreview ? CARD_MIN_HEIGHT : "auto",
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
          cursor: !localShowPreview ? "pointer" : "default",
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
              mb: localShowPreview ? 2 : 0,
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
                    color: "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "primary.main",
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
                    color: "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: "error.main",
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
                    color: isCopied ? "success.main" : "text.secondary",
                    transition: "all 0.2s",
                    "&:hover": {
                      color: isCopied ? "success.main" : "primary.main",
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

          {localShowPreview && (
            <Box
              onClick={handleContentClick}
              sx={{
                bgcolor: isDark ? "background.default" : "grey.100",
                p: 1.5,
                borderRadius: 1,
                mb: 2,
                height: CONTENT_HEIGHT,
                overflow: "auto",
                flexGrow: 1,
                cursor: "pointer",
                "&:hover": {
                  bgcolor: isDark ? "rgba(255,255,255,0.03)" : "grey.200",
                },
                "& pre": {
                  m: 0,
                  p: 0,
                  bgcolor: "transparent",
                },
                "& code": {
                  fontFamily: "monospace",
                  fontSize: "0.875rem",
                },
                "& p": {
                  m: 0,
                  mb: 1,
                },
                "& > div": {
                  height: "100%",
                },
              }}
            >
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                }}
              >
                {block.content}
              </ReactMarkdown>
            </Box>
          )}

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
      </Card>

      <FullscreenModal
        open={isContentExpanded}
        onClose={() => setIsContentExpanded(false)}
        closeAfterTransition
      >
        <Fade in={isContentExpanded}>
          <ModalContent
            sx={{
              borderTop: category?.color
                ? `4px solid ${category.color}`
                : undefined,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 3,
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
                position: "sticky",
                top: 0,
                zIndex: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="h5">{block.title}</Typography>
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
              <Box sx={{ display: "flex", gap: 1 }}>
                <Tooltip title="Kopieer inhoud">
                  <IconButton
                    onClick={handleCopy}
                    sx={{
                      color: isCopied ? "success.main" : "text.secondary",
                      "&:hover": {
                        color: isCopied ? "success.main" : "primary.main",
                      },
                    }}
                  >
                    {isCopied ? <CheckIcon /> : <ContentCopyIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Bewerken">
                  <IconButton
                    onClick={() => {
                      setIsContentExpanded(false);
                      setIsEditModalOpen(true);
                    }}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "primary.main",
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Sluiten">
                  <IconButton
                    onClick={() => setIsContentExpanded(false)}
                    sx={{
                      color: "text.secondary",
                      "&:hover": {
                        color: "error.main",
                      },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            <Box
              sx={{
                p: 3,
                overflow: "auto",
                flexGrow: 1,
              }}
            >
              <Box
                sx={{
                  bgcolor: isDark ? "background.default" : "grey.100",
                  p: 3,
                  borderRadius: 1,
                  "& pre": { m: 0, p: 0, bgcolor: "transparent" },
                  "& code": { fontFamily: "monospace" },
                }}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code: CodeBlock,
                  }}
                >
                  {block.content}
                </ReactMarkdown>
              </Box>
            </Box>
          </ModalContent>
        </Fade>
      </FullscreenModal>

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

      <Snackbar
        open={showCopiedMessage}
        autoHideDuration={2000}
        onClose={() => setShowCopiedMessage(false)}
        message="Tekst gekopieerd naar klembord"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
}

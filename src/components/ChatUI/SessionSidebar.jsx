// 📁 File: src/components/ChatUI/SessionSidebar.jsx
import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Divider,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Close,
  Add,
  Edit,
  Delete,
  Chat,
  Folder,
  MoreVert,
  History,
  Star,
} from "@mui/icons-material";

const SessionSidebar = ({
  sessions,
  activeSession,
  onSelect,
  onRename,
  onDelete,
  onNew,
  onToggle,
}) => {
  const [renameDialog, setRenameDialog] = useState({ open: false, session: null, newName: "" });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, session: null });

  const handleRenameClick = (session) => {
    setRenameDialog({ open: true, session, newName: session.name });
  };

  const handleRenameConfirm = () => {
    if (renameDialog.newName.trim()) {
      onRename(renameDialog.session.id, renameDialog.newName.trim());
    }
    setRenameDialog({ open: false, session: null, newName: "" });
  };

  const handleDeleteClick = (session) => {
    setDeleteDialog({ open: true, session });
  };

  const handleDeleteConfirm = () => {
    onDelete(deleteDialog.session.id);
    setDeleteDialog({ open: false, session: null });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <>
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -300, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Paper
          elevation={8}
          sx={{
            width: 320,
            height: "100vh",
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            borderRight: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 0,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{
                  background: "linear-gradient(45deg, #00eaff, #7f53ac)",
                  width: 32,
                  height: 32,
                }}
              >
                <Folder />
              </Avatar>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                Sessions
              </Typography>
            </Box>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Tooltip title="New Session">
                <IconButton
                  onClick={onNew}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      color: "#00eaff",
                      background: "rgba(0,234,255,0.1)",
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close Sidebar">
                <IconButton
                  onClick={onToggle}
                  sx={{
                    color: "rgba(255,255,255,0.7)",
                    "&:hover": {
                      color: "#f44336",
                      background: "rgba(244,67,54,0.1)",
                    },
                  }}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Sessions List */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            <AnimatePresence>
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem
                    button
                    selected={activeSession === session.id}
                    onClick={() => onSelect(session.id)}
                    sx={{
                      background: activeSession === session.id
                        ? "rgba(0,234,255,0.15)"
                        : "transparent",
                      borderLeft: activeSession === session.id
                        ? "3px solid #00eaff"
                        : "3px solid transparent",
                      "&:hover": {
                        background: "rgba(255,255,255,0.05)",
                      },
                      "&.Mui-selected": {
                        background: "rgba(0,234,255,0.15)",
                        "&:hover": {
                          background: "rgba(0,234,255,0.2)",
                        },
                      },
                    }}
                  >
                    <ListItemIcon>
                      <Avatar
                        sx={{
                          background: activeSession === session.id
                            ? "linear-gradient(45deg, #00eaff, #7f53ac)"
                            : "rgba(255,255,255,0.1)",
                          width: 32,
                          height: 32,
                        }}
                      >
                        <Chat fontSize="small" />
                      </Avatar>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#fff",
                            fontWeight: activeSession === session.id ? 600 : 400,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {session.name}
                        </Typography>
                      }
                      secondary={
                        <Typography
                          variant="caption"
                          sx={{ color: "rgba(255,255,255,0.6)" }}
                        >
                          {formatDate(session.id.split('-')[1])}
                        </Typography>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Rename">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRenameClick(session);
                            }}
                            sx={{
                              color: "rgba(255,255,255,0.5)",
                              "&:hover": {
                                color: "#ff9800",
                                background: "rgba(255,152,0,0.1)",
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(session);
                            }}
                            sx={{
                              color: "rgba(255,255,255,0.5)",
                              "&:hover": {
                                color: "#f44336",
                                background: "rgba(244,67,54,0.1)",
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </ListItemSecondaryAction>
                  </ListItem>
                  {index < sessions.length - 1 && (
                    <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            
            {sessions.length === 0 && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 200,
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                <History sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="body2">No sessions yet</Typography>
                <Typography variant="caption">Create your first session to get started</Typography>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              p: 2,
              borderTop: "1px solid rgba(255,255,255,0.2)",
              background: "rgba(0,0,0,0.1)",
            }}
          >
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={onNew}
              sx={{
                background: "linear-gradient(45deg, #00eaff, #7f53ac)",
                color: "#fff",
                fontWeight: 600,
                "&:hover": {
                  background: "linear-gradient(45deg, #00d4e6, #6a4a9a)",
                },
              }}
            >
              New Session
            </Button>
          </Box>
        </Paper>
      </motion.div>

      {/* Rename Dialog */}
      <Dialog
        open={renameDialog.open}
        onClose={() => setRenameDialog({ open: false, session: null, newName: "" })}
        PaperProps={{
          sx: {
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>Rename Session</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={renameDialog.newName}
            onChange={(e) => setRenameDialog(prev => ({ ...prev, newName: e.target.value }))}
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": {
                color: "#fff",
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(255,255,255,0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#00eaff",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRenameDialog({ open: false, session: null, newName: "" })}
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleRenameConfirm}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #00eaff, #7f53ac)",
              color: "#fff",
            }}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, session: null })}
        PaperProps={{
          sx: {
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff" }}>Delete Session</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(255,255,255,0.8)" }}>
            Are you sure you want to delete "{deleteDialog.session?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, session: null })}
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              background: "linear-gradient(45deg, #f44336, #d32f2f)",
              color: "#fff",
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SessionSidebar;

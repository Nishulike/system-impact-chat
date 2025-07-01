// 📁 File: src/components/ChatUI/ChatWrapper.jsx
import React, { useState, useEffect } from "react";
import { Box, Fab, Tooltip } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen } from "@mui/icons-material";
import SessionSidebar from "./SessionSidebar";
import ChatUI from "./ChatUI";
import "./ChatUI.css";
import "./ChatWrapper.css";

const ChatWrapper = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const generateId = () => `sess-${Date.now()}`;

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("chat_sessions")) || [];
    if (stored.length === 0) {
      const defaultSession = { id: generateId(), name: "New Session" };
      setSessions([defaultSession]);
      setActiveSession(defaultSession.id);
    } else {
      setSessions(stored);
      setActiveSession(stored[0].id);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem("chat_sessions", JSON.stringify(sessions));
    }
  }, [sessions, initialized]);

  const handleRename = (id) => {
    const newName = prompt("Rename session:");
    if (newName) {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
      );
    }
  };

  const handleDelete = (id) => {
    // Remove session and its messages locally
    localStorage.removeItem(`messages-${id}`);
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);

    // Update active session
    if (id === activeSession && updated.length > 0) {
      setActiveSession(updated[0].id);
    } else if (updated.length === 0) {
      const newSess = { id: generateId(), name: "New Session" };
      setSessions([newSess]);
      setActiveSession(newSess.id);
    }
  };

  const handleNewSession = () => {
    const newSess = { id: generateId(), name: "New Session" };
    setSessions((prev) => [newSess, ...prev]);
    setActiveSession(newSess.id);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && initialized && (
          <SessionSidebar
            sessions={sessions}
            activeSession={activeSession}
            onSelect={setActiveSession}
            onRename={handleRename}
            onDelete={handleDelete}
            onNew={handleNewSession}
            onToggle={() => setShowSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <ChatUI sessionId={activeSession} />
      </Box>

      {/* Floating Sidebar Toggle Button */}
      {!showSidebar && initialized && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            zIndex: 1000,
          }}
        >
          <Tooltip title="Open Sessions" placement="right">
            <Fab
              size="medium"
              onClick={() => setShowSidebar(true)}
              sx={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff",
                "&:hover": {
                  background: "rgba(255,255,255,0.2)",
                  transform: "scale(1.1)",
                },
              }}
            >
              <FolderOpen />
            </Fab>
          </Tooltip>
        </motion.div>
      )}
    </Box>
  );
};

export default ChatWrapper;

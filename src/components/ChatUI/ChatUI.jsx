import React, { useState, useEffect, useRef, useMemo } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Fab,
  Chip,
  Avatar,
  Tooltip,
  CircularProgress,
  Slide,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Psychology,
  Settings,
  Refresh,
} from "@mui/icons-material";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import DownloadButton from "./DownloadButton";
import "./ChatUI.css";

const ChatUI = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [reportData, setReportData] = useState(null);
  const chatEndRef = useRef(null);

  // ✅ Memoize welcomeMessage to avoid ESLint warning and unnecessary re-renders
  const welcomeMessage = useMemo(() => ({
    sender: "system",
    text: `👋 Hello! I'm your **System Impact Analyst Assistant**.

🧠 I help you analyze the impact of system changes across:
- Functional Logic
- Data
- APIs
- UI/UX
- Compliance
- Access Control
- Performance

📘 You can:
- Provide a **detailed summary**
- Or just describe **what you want to change** in your system

🔍 I'll:
- Ask clarifying questions if needed
- Suggest responses you can accept, modify, or expand
- Use various tools to assess the change

📄 At the end, you can **generate a professional System Impact Report**.

✍️ **Please provide your change request below to begin!**`,
  }), []);

  useEffect(() => {
    const stored = localStorage.getItem(`messages-${sessionId}`);
    const previous = stored ? JSON.parse(stored) : [];
    setMessages([welcomeMessage, ...previous]);
  }, [sessionId, welcomeMessage]);

  useEffect(() => {
    const filtered = messages.filter(
      (msg) => !(msg.sender === "system" && msg.text === welcomeMessage.text)
    );
    localStorage.setItem(`messages-${sessionId}`, JSON.stringify(filtered));
  }, [messages, sessionId, welcomeMessage.text]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const sendMessage = async (input) => {
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:7860/api/v1/run/07cb856f-2902-42cd-b02e-9c2d34256617",
        {
          input_value: input,
          output_type: "chat",
          input_type: "chat",
          session_id: sessionId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      let reply = "⚠️ No valid response from system.";
      const nestedText = res?.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text;

      if (nestedText) {
        const cleaned = nestedText.replace(/^json\s*/i, "").trim();
        try {
          const parsed = JSON.parse(cleaned);
          if (parsed.status === "clarification_needed") {
            reply = `🟡 **Clarification Needed**\n\n**Q:** ${parsed.clarification_question}\n\n💡 *Suggested:* ${parsed.suggested_value || "N/A"}\n\n➤ Do you want to add this? (yes / no / explain more)`;
          } else if (parsed.status === "complete" && parsed.document_payload) {
            reply = "✅ System Impact Report is ready. Click below to download.";
            setReportData(parsed);
          } else {
            reply = "📦 " + JSON.stringify(parsed, null, 2);
          }
        } catch {
          reply = nestedText;
        }
      } else {
        reply = "📦 Raw Fallback: " + JSON.stringify(res.data, null, 2);
      }

      setMessages((prev) => [...prev, { sender: "system", text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "❌ Error connecting to analyzer." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    const input = inputValue.trim();
    if (!input) return;
    setInputValue("");
    sendMessage(input);
  };

  const handleClarificationClick = (choice) => {
    let emoji = "❓";
    if (choice === "yes") emoji = "✅";
    else if (choice === "no") emoji = "❌";
    else if (choice === "explain more") emoji = "ℹ️";
    sendMessage(emoji);
  };

  const handleFeedbackClick = (emoji) => {
    sendMessage(emoji);
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background particles */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 20% 80%, rgba(0,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,0,255,0.1) 0%, transparent 50%)",
          zIndex: 0,
        }}
      />

      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          background: "rgba(255,255,255,0.1)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          borderRadius: 0,
          zIndex: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                background: "linear-gradient(45deg, #00eaff, #7f53ac)",
                width: 40,
                height: 40,
              }}
            >
              <Psychology />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700 }}>
                System Impact Analyst
              </Typography>
              <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
                AI-powered system analysis
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
                <Settings />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton sx={{ color: "rgba(255,255,255,0.7)" }}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      {/* Chat Messages */}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: 3,
          py: 2,
          position: "relative",
          zIndex: 1,
        }}
      >
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <MessageBubble
                sender={msg.sender}
                text={msg.text}
                onClarificationClick={handleClarificationClick}
                onFeedbackClick={handleFeedbackClick}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <TypingIndicator />
          </motion.div>
        )}
        <div ref={chatEndRef} />
      </Box>

      {/* Floating Input Bar */}
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Paper
          elevation={8}
          sx={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 3,
            mx: 3,
            mb: 3,
            p: 2,
            zIndex: 2,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSend}
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your system change request..."
              variant="outlined"
              sx={{
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
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(255,255,255,0.6)",
                    opacity: 1,
                  },
                },
              }}
            />
            <Fab
              type="submit"
              disabled={!inputValue.trim() || loading}
              sx={{
                background: "linear-gradient(45deg, #00eaff, #7f53ac)",
                color: "#fff",
                "&:hover": {
                  background: "linear-gradient(45deg, #00d4e6, #6a4a9a)",
                },
                "&:disabled": {
                  background: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.5)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                <Send />
              )}
            </Fab>
          </Box>
          
          {/* Quick Action Chips */}
          <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
            <Chip
              label="System Change"
              size="small"
              onClick={() => setInputValue("I want to change the user authentication system...")}
              sx={{
                background: "rgba(0,234,255,0.2)",
                color: "#00eaff",
                border: "1px solid rgba(0,234,255,0.3)",
                "&:hover": {
                  background: "rgba(0,234,255,0.3)",
                },
              }}
            />
            <Chip
              label="API Modification"
              size="small"
              onClick={() => setInputValue("I need to modify the payment API...")}
              sx={{
                background: "rgba(127,83,172,0.2)",
                color: "#7f53ac",
                border: "1px solid rgba(127,83,172,0.3)",
                "&:hover": {
                  background: "rgba(127,83,172,0.3)",
                },
              }}
            />
            <Chip
              label="Database Schema"
              size="small"
              onClick={() => setInputValue("I want to update the database schema...")}
              sx={{
                background: "rgba(255,193,7,0.2)",
                color: "#ffc107",
                border: "1px solid rgba(255,193,7,0.3)",
                "&:hover": {
                  background: "rgba(255,193,7,0.3)",
                },
              }}
            />
          </Box>
        </Paper>
      </Slide>

      {/* Download Button */}
      <Box sx={{ position: "absolute", bottom: 20, right: 20, zIndex: 3 }}>
        <DownloadButton reportData={reportData} />
      </Box>
    </Box>
  );
};

export default ChatUI;

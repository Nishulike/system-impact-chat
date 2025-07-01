import React from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Person,
  SmartToy,
  ThumbUp,
  ThumbDown,
  Help,
  CheckCircle,
  Cancel,
  Info,
} from "@mui/icons-material";
import ReactMarkdown from "react-markdown";

const MessageBubble = ({
  sender,
  text,
  onClarificationClick,
  onFeedbackClick,
}) => {
  const isUser = sender === "user";
  const isSystem = sender === "system";

  const handleClarificationClick = (choice) => {
    if (onClarificationClick) {
      onClarificationClick(choice);
    }
  };

  const handleFeedbackClick = (emoji) => {
    if (onFeedbackClick) {
      onFeedbackClick(emoji);
    }
  };

  // Check if message contains clarification request
  const hasClarification = text.includes("Clarification Needed");
  const hasReportReady = text.includes("System Impact Report is ready");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: 16,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isUser ? "row-reverse" : "row",
          alignItems: "flex-start",
          gap: 2,
          maxWidth: "80%",
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            background: isUser
              ? "linear-gradient(45deg, #2196F3, #21CBF3)"
              : "linear-gradient(45deg, #00eaff, #7f53ac)",
            width: 40,
            height: 40,
            mt: 1,
          }}
        >
          {isUser ? <Person /> : <SmartToy />}
        </Avatar>

        {/* Message Content */}
        <Paper
          elevation={0}
          sx={{
            background: isUser
              ? "rgba(33, 150, 243, 0.1)"
              : "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            border: isUser
              ? "1px solid rgba(33, 150, 243, 0.3)"
              : "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            p: 2,
            position: "relative",
            minWidth: 200,
          }}
        >
          {/* Message Text */}
          <Box
            sx={{
              color: "#fff",
              "& h1, & h2, & h3, & h4, & h5, & h6": {
                color: "#fff",
                marginTop: 1,
                marginBottom: 1,
              },
              "& p": {
                marginBottom: 1,
                lineHeight: 1.6,
              },
              "& ul, & ol": {
                marginLeft: 2,
                marginBottom: 1,
              },
              "& li": {
                marginBottom: 0.5,
              },
              "& code": {
                background: "rgba(0,0,0,0.3)",
                padding: "2px 6px",
                borderRadius: 2,
                fontFamily: "monospace",
              },
              "& pre": {
                background: "rgba(0,0,0,0.3)",
                padding: 2,
                borderRadius: 2,
                overflow: "auto",
              },
              "& strong": {
                fontWeight: 700,
                color: "#00eaff",
              },
              "& em": {
                fontStyle: "italic",
                color: "rgba(255,255,255,0.8)",
              },
            }}
          >
            <ReactMarkdown>{text}</ReactMarkdown>
          </Box>

          {/* Clarification Buttons */}
          {hasClarification && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.7)", mb: 1, display: "block" }}
              >
                Quick Response:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<CheckCircle />}
                  onClick={() => handleClarificationClick("yes")}
                  sx={{
                    borderColor: "#4caf50",
                    color: "#4caf50",
                    "&:hover": {
                      borderColor: "#45a049",
                      background: "rgba(76, 175, 80, 0.1)",
                    },
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Cancel />}
                  onClick={() => handleClarificationClick("no")}
                  sx={{
                    borderColor: "#f44336",
                    color: "#f44336",
                    "&:hover": {
                      borderColor: "#d32f2f",
                      background: "rgba(244, 67, 54, 0.1)",
                    },
                  }}
                >
                  No
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Info />}
                  onClick={() => handleClarificationClick("explain more")}
                  sx={{
                    borderColor: "#ff9800",
                    color: "#ff9800",
                    "&:hover": {
                      borderColor: "#f57c00",
                      background: "rgba(255, 152, 0, 0.1)",
                    },
                  }}
                >
                  Explain More
                </Button>
              </Box>
            </Box>
          )}

          {/* Report Ready Message */}
          {hasReportReady && (
            <Box sx={{ mt: 2 }}>
              <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.2)" }} />
              <Chip
                icon={<CheckCircle />}
                label="Report Generated Successfully"
                sx={{
                  background: "rgba(76, 175, 80, 0.2)",
                  color: "#4caf50",
                  border: "1px solid rgba(76, 175, 80, 0.3)",
                }}
              />
            </Box>
          )}

          {/* Feedback Buttons for System Messages */}
          {isSystem && !hasClarification && !hasReportReady && (
            <Box sx={{ mt: 2, display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <Tooltip title="Helpful">
                <IconButton
                  size="small"
                  onClick={() => handleFeedbackClick("👍")}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": {
                      color: "#4caf50",
                      background: "rgba(76, 175, 80, 0.1)",
                    },
                  }}
                >
                  <ThumbUp fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Not Helpful">
                <IconButton
                  size="small"
                  onClick={() => handleFeedbackClick("👎")}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": {
                      color: "#f44336",
                      background: "rgba(244, 67, 54, 0.1)",
                    },
                  }}
                >
                  <ThumbDown fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Need Help">
                <IconButton
                  size="small"
                  onClick={() => handleFeedbackClick("❓")}
                  sx={{
                    color: "rgba(255,255,255,0.6)",
                    "&:hover": {
                      color: "#ff9800",
                      background: "rgba(255, 152, 0, 0.1)",
                    },
                  }}
                >
                  <Help fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Paper>
      </Box>
    </motion.div>
  );
};

export default MessageBubble;

import React from "react";
import { Box, Paper, Avatar, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { SmartToy } from "@mui/icons-material";

const TypingIndicator = () => {
  const dotVariants = {
    animate: {
      y: ["0%", "-50%", "0%"],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        justifyContent: "flex-start",
        marginBottom: 16,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          maxWidth: "80%",
        }}
      >
        {/* Avatar */}
        <Avatar
          sx={{
            background: "linear-gradient(45deg, #00eaff, #7f53ac)",
            width: 40,
            height: 40,
            mt: 1,
          }}
        >
          <SmartToy />
        </Avatar>

        {/* Typing Indicator */}
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.08)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: 3,
            p: 2,
            minWidth: 120,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.7)", mr: 1 }}
            >
              AI is thinking
            </Typography>
            
            {/* Animated Dots */}
            <Box sx={{ display: "flex", gap: 0.5 }}>
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  variants={dotVariants}
                  animate="animate"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#00eaff",
                  }}
                  transition={{
                    delay: index * 0.2,
                  }}
                />
              ))}
            </Box>
          </Box>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default TypingIndicator;

// 📁 src/components/StartWindow/StartWindow.jsx
import React from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Brain, BookOpen, FileText, BarChart } from "lucide-react";
import "./StartWindow.css";

const features = [
  {
    title: "Knowledge Retrieval",
    summary:
      "Access internal documentation using intelligent search and AI understanding.",
    icon: <BookOpen size={36} />,
  },
  {
    title: "System Impact Analysis",
    summary:
      "Analyze system changes with clarification flow, RAG, tool assessments, and report generation.",
    icon: <Brain size={36} />,
    redirectTo: "/chat",
  },
  {
    title: "Document Preparation",
    summary:
      "Transform data into professional documents: formatted, styled, and export-ready.",
    icon: <FileText size={36} />,
  },
  {
    title: "Project Manager",
    summary:
      "Visualize project timelines, assign tasks, and track real-time progress with AI help.",
    icon: <BarChart size={36} />,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, type: "spring", stiffness: 120 },
  }),
};

const StartWindow = () => {
  const navigate = useNavigate();

  const handleClick = (feature) => {
    if (feature.redirectTo) {
      navigate(feature.redirectTo);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)",
      }}
    >
      {/* Background video layer */}
      <video
        className="bg-video"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
          opacity: 0.25,
        }}
      >
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Gradient overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle at 60% 40%, rgba(0,255,255,0.12) 0%, transparent 70%), radial-gradient(circle at 20% 80%, rgba(255,0,255,0.10) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />
      
      {/* Content Layer */}
      <Box
        className="start-content"
        sx={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: 1400,
          px: 3,
          py: 6,
        }}
      >
        <Typography
          variant="h2"
          align="center"
          sx={{
            fontWeight: 800,
            letterSpacing: 1,
            color: "#fff",
            mb: 5,
            textShadow: "0 4px 32px #0008",
          }}
        >
          Welcome to the AI Agent System
        </Typography>
        
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            justifyContent: "center",
            alignItems: "stretch",
            flexWrap: "nowrap",
            width: "100%",
          }}
        >
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ scale: 1.06, boxShadow: "0 8px 32px #00eaff44" }}
              style={{ flex: "1 1 0", minWidth: 0 }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.08)",
                  boxShadow:
                    "0 2px 16px 0 rgba(0,0,0,0.18), 0 1.5px 8px 0 rgba(0,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  border: feature.redirectTo ? "2px solid #00eaff" : "1px solid #fff2",
                  cursor: feature.redirectTo ? "pointer" : "default",
                  transition: "border 0.2s, box-shadow 0.2s",
                  minHeight: 320,
                }}
                onClick={() => handleClick(feature)}
                elevation={0}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#fff" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#e0e0e0", mt: 1, minHeight: 48 }}
                  >
                    {feature.summary}
                  </Typography>
                  {feature.redirectTo && (
                    <Button
                      variant="contained"
                      sx={{
                        mt: 3,
                        background:
                          "linear-gradient(90deg, #00eaff 0%, #7f53ac 100%)",
                        color: "#fff",
                        fontWeight: 700,
                        borderRadius: 2,
                        boxShadow: "0 2px 8px #00eaff33",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(feature);
                      }}
                      size="large"
                      fullWidth
                    >
                      🚀 Try Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default StartWindow;

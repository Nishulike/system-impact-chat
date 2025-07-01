// 📁 File: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import ChatWrapper from "./components/ChatUI/ChatWrapper";
import StartWindow from "./components/StartWindow/StartWindow"; // ✅ Import the new component
import "./App.css";
import "./components/ChatUI/ChatUI.css";
import "./components/ChatUI/ChatWrapper.css";

// Create a custom dark theme
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00eaff",
      light: "#33eeff",
      dark: "#00b8cc",
    },
    secondary: {
      main: "#7f53ac",
      light: "#9a6bc0",
      dark: "#5e3a7a",
    },
    background: {
      default: "#0f2027",
      paper: "rgba(255,255,255,0.1)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255,255,255,0.7)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<StartWindow />} />
          <Route path="/chat" element={<ChatWrapper />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

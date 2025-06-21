// 📁 File: src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatWrapper from "./components/ChatUI/ChatWrapper";
import StartWindow from "./components/StartWindow/StartWindow"; // ✅ Import the new component
import "./App.css";
import "./components/ChatUI/ChatUI.css";
import "./components/ChatUI/ChatWrapper.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartWindow />} />
        <Route path="/chat" element={<ChatWrapper />} />
      </Routes>
    </Router>
  );
}

export default App;

// 📁 File: src/App.js
import React from "react";
import ChatWrapper from "./components/ChatUI/ChatWrapper"; // ✅ Use the wrapper
import "./App.css";
import "./components/ChatUI/ChatUI.css";
import "./components/ChatUI/ChatWrapper.css"; // ✅ Ensure wrapper styles are loaded

function App() {
  return <ChatWrapper />; // ✅ This wraps SessionSidebar + ChatUI with toggle logic
}

export default App;

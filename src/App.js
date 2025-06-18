import React from "react";
import ChatUI from "./components/ChatUI/ChatUI";
import SessionSidebar from "./components/ChatUI/SessionSidebar";
import "./App.css";
import "./components/ChatUI/ChatUI.css";
import "./components/ChatUI/ChatWrapper.css"; // ensures layout styling for chat-wrapper

function App() {
  return (
    <div className="chat-wrapper">
      <SessionSidebar />
      <ChatUI />
    </div>
  );
}

export default App;

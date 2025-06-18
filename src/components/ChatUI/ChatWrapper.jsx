// 📁 File: src/components/ChatUI/ChatWrapper.jsx
import React, { useState, useEffect } from "react";
import SessionSidebar from "./SessionSidebar";
import ChatUI from "./ChatUI";
import "./ChatUI.css";

const ChatWrapper = () => {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);

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
  }, []);

  useEffect(() => {
    localStorage.setItem("chat_sessions", JSON.stringify(sessions));
  }, [sessions]);

  const handleRename = (id) => {
    const newName = prompt("Rename session:");
    if (newName) {
      setSessions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, name: newName } : s))
      );
    }
  };

  const handleDelete = (id) => {
    const filtered = sessions.filter((s) => s.id !== id);
    setSessions(filtered);
    if (id === activeSession && filtered.length > 0) {
      setActiveSession(filtered[0].id);
    } else if (filtered.length === 0) {
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
    <div className="chat-wrapper">
      {showSidebar && (
        <SessionSidebar
          sessions={sessions}
          activeSession={activeSession}
          onSelect={setActiveSession}
          onRename={handleRename}
          onDelete={handleDelete}
          onNew={handleNewSession}
          onToggle={() => setShowSidebar(false)} // 👈 Close button inside sidebar
        />
      )}
      {!showSidebar && (
        <button
          className="open-sidebar-btn"
          onClick={() => setShowSidebar(true)}
        >
          📂 Open Sidebar
        </button>
      )}
      <ChatUI sessionId={activeSession} />
    </div>
  );
};

export default ChatWrapper;

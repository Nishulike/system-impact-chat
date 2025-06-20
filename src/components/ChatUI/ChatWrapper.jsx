// 📁 File: src/components/ChatUI/ChatWrapper.jsx
import React, { useState, useEffect } from "react";
import SessionSidebar from "./SessionSidebar";
import ChatUI from "./ChatUI";
import "./ChatUI.css";
import "./ChatWrapper.css"; // Ensure correct file name casing

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
    <div className={`chat-wrapper ${!showSidebar ? "sidebar-hidden" : ""}`}>
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

      <ChatUI sessionId={activeSession} />

      {!showSidebar && initialized && (
        <button
          className="open-sidebar-btn"
          onClick={() => setShowSidebar(true)}
        >
          📂 Open Sidebar
        </button>
      )}
    </div>
  );
};

export default ChatWrapper;

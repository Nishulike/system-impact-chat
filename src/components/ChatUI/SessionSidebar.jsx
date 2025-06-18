// 📁 File: src/components/ChatUI/SessionSidebar.jsx
import React from "react";
import "./ChatUI.css";

const SessionSidebar = ({
  sessions = [],
  activeSession,
  onSelect,
  onRename,
  onDelete,
  onNew,
  onToggle, // 👈 close handler
}) => {
  return (
    <div className="session-sidebar">
      <div className="sidebar-header">
        <h3>Sessions</h3>
        {onToggle && (
          <button className="sidebar-close-btn" onClick={onToggle} title="Close Sidebar">
            ✖
          </button>
        )}
      </div>

      <button className="new-session-btn" onClick={onNew}>
        ➕ New Session
      </button>

      {sessions.length === 0 ? (
        <p className="no-sessions">No sessions yet</p>
      ) : (
        <ul className="session-list">
          {sessions.map((session) => (
            <li
              key={session.id}
              className={`session-item ${session.id === activeSession ? "active" : ""}`}
              onClick={() => onSelect(session.id)}
            >
              <span className="session-name">{session.name}</span>
              <div className="session-actions">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRename(session.id);
                  }}
                  title="Rename"
                >
                  ✏️
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SessionSidebar;

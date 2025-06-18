// MessageBubble.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import "./ChatUI.css";

const MessageBubble = ({ sender, text }) => {
  const isUser = sender === "user";

  return (
    <div className={`message-bubble ${isUser ? "user" : "system"}`}>
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
};

export default MessageBubble;

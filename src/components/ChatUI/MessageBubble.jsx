import React from "react";
import "./ChatUI.css";

const MessageBubble = ({ sender, text, onFeedbackClick, onClarificationClick }) => {
  const isClarification =
    sender === "system" &&
    text.toLowerCase().includes("do you want to add this?");

  return (
    <div className={`message-bubble ${sender}`}>
      <div
        className="message-text"
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, "<br/>") }}
      />

      {isClarification && (
        <>
          {/* Clarification Buttons */}
          <div className="clarification-buttons">
            <button onClick={() => onClarificationClick("yes")}>✅ Yes</button>
            <button onClick={() => onClarificationClick("no")}>❌ No</button>
            <button onClick={() => onClarificationClick("explain more")}>ℹ️ Explain More</button>
          </div>

          {/* Feedback Buttons */}
          <div className="feedback-buttons">
            <button
              className="thumb-button"
              onClick={() => onFeedbackClick("👍")}
              title="Helpful"
            >
              👍
            </button>
            <button
              className="thumb-button"
              onClick={() => onFeedbackClick("👎")}
              title="Irrelevant"
            >
              👎
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageBubble;

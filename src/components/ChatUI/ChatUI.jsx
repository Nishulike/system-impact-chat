import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import DownloadButton from "./DownloadButton";
import "./ChatUI.css";

const ChatUI = ({ sessionId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const welcomeMessage = {
    sender: "system",
    text: `👋 Hello! I’m your **System Impact Analyst Assistant**.

🧠 I help you analyze the impact of system changes across:
- Functional Logic
- Data
- APIs
- UI/UX
- Compliance
- Access Control
- Performance

📘 You can:
- Provide a **detailed summary**
- Or just describe **what you want to change** in your system

🔍 I’ll:
- Ask clarifying questions if needed
- Suggest responses you can accept, modify, or expand
- Use various tools to assess the change

📄 At the end, you can **generate a professional System Impact Report**.

✍️ **Please provide your change request below to begin!**`,
  };

  // Show welcome message + load stored messages
  useEffect(() => {
    const stored = localStorage.getItem(`messages-${sessionId}`);
    const previous = stored ? JSON.parse(stored) : [];
    setMessages([welcomeMessage, ...previous]);
  }, [sessionId]);

  // Save user/system messages (excluding welcome) to localStorage
  useEffect(() => {
    const filtered = messages.filter(
      (msg) => !(msg.sender === "system" && msg.text === welcomeMessage.text)
    );
    localStorage.setItem(`messages-${sessionId}`, JSON.stringify(filtered));
  }, [messages, sessionId]);

  const handleSend = async (e) => {
    e.preventDefault();
    const input = e.target.message.value.trim();
    if (!input) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://127.0.0.1:7860/api/v1/run/07cb856f-2902-42cd-b02e-9c2d34256617",
        {
          input_value: input,
          output_type: "chat",
          input_type: "chat",
          session_id: sessionId,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      let reply = "⚠️ No valid response from system.";
      const nestedText = res?.data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text;

      if (nestedText) {
        const cleaned = nestedText.replace(/^json\s*/i, "").trim();
        try {
          const parsed = JSON.parse(cleaned);
          if (parsed.status === "clarification_needed") {
            reply = `🟡 **Clarification Needed**\n\n**Q:** ${parsed.clarification_question}\n\n💡 *Suggested:* ${parsed.suggested_value || "N/A"}`;
          } else if (parsed.status === "complete" && parsed.document_payload) {
            reply = "✅ System Impact Report is ready. Click below to download.";
          } else {
            reply = "📦 " + JSON.stringify(parsed, null, 2);
          }
        } catch {
          reply = nestedText;
        }
      } else {
        reply = "📦 Raw Fallback: " + JSON.stringify(res.data, null, 2);
      }

      setMessages((prev) => [...prev, { sender: "system", text: reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "system", text: "❌ Error connecting to analyzer." },
      ]);
    } finally {
      setLoading(false);
      e.target.reset();
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  return (
    <div className="chat-window">
      <div className="chat-header">🧠 System Impact Analyst</div>

      <div className="chat-body">
        {messages.map((msg, i) => (
          <MessageBubble key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input-area" onSubmit={handleSend}>
        <input
          name="message"
          placeholder="Type your request..."
          autoComplete="off"
        />
        <button type="submit">➤</button>
      </form>

      <DownloadButton />
    </div>
  );
};

export default ChatUI;

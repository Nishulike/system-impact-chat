// 📁 src/components/StartWindow/StartWindow.jsx
import React from "react";
import "./StartWindow.css";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "📚 Knowledge Retrieval",
    summary:
      "Access internal documentation using intelligent search and AI understanding.",
  },
  {
    title: "🧠 System Impact Analysis",
    summary:
      "Analyze system changes with clarification flow, RAG, tool assessments, and report generation.",
    redirectTo: "/chat",
  },
  {
    title: "📝 Document Preparation",
    summary:
      "Transform data into professional documents: formatted, styled, and export-ready.",
  },
  {
    title: "📈 Project Manager",
    summary:
      "Visualize project timelines, assign tasks, and track real-time progress with AI help.",
  },
];

const StartWindow = () => {
  const navigate = useNavigate();

  const handleClick = (feature) => {
    if (feature.redirectTo) {
      navigate(feature.redirectTo);
    }
  };

  return (
    <div className="start-window">
      {/* 🔁 Background video */}
      <video className="bg-video" autoPlay muted loop playsInline>
        <source src="/background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Content Layer */}
      <div className="start-content">
        <h1 className="start-title">Welcome to the AI Agent System</h1>
        <div className="feature-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card-wrapper">
              <div
                className={`feature-card ${feature.redirectTo ? "clickable" : ""}`}
                onClick={() => handleClick(feature)}
              >
                <h2 className="feature-title">{feature.title}</h2>
              </div>
              <div className="feature-popup">
                <div className="popup-arrow" />
                <div className="popup-content">
                  <p>{feature.summary}</p>
                  {feature.redirectTo && (
                    <button onClick={() => handleClick(feature)}>🚀 Try Now</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StartWindow;

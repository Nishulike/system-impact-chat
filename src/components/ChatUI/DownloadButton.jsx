import React from "react";
import "./ChatUI.css";

const DownloadButton = () => {
  const handleDownload = () => {
    alert("Downloading System Impact Analysis Report...");
    // Later: trigger actual download logic
  };

  return (
    <button className="download-button" onClick={handleDownload}>
      📄 Download Report
    </button>
  );
};

export default DownloadButton;

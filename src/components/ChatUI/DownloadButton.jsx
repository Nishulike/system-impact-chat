import React, { useState } from "react";
import {
  Fab,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Description,
  PictureAsPdf,
  FileDownload,
  CheckCircle,
  Error,
} from "@mui/icons-material";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";

const DownloadButton = ({ reportData }) => {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState(null);

  // Function to convert JSON data to formatted text
  const formatReportData = (data) => {
    if (!data || !data.document_payload) {
      return "No report data available.";
    }

    const report = data.document_payload["System Impact Analysis Report"];
    let formattedText = "";

    // Helper function to format nested objects
    const formatNestedObject = (obj, level = 0) => {
      let text = "";
      const indent = "  ".repeat(level);
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          text += `${indent}${key}:\n`;
          text += formatNestedObject(value, level + 1);
        } else {
          text += `${indent}${key}: ${value || "N/A"}\n`;
        }
      }
      return text;
    };

    // Format each section
    for (const [sectionKey, sectionData] of Object.entries(report)) {
      formattedText += `\n${sectionKey}\n`;
      formattedText += "=".repeat(sectionKey.length) + "\n\n";
      
      if (typeof sectionData === "object" && sectionData !== null) {
        formattedText += formatNestedObject(sectionData, 1);
      } else {
        formattedText += `${sectionData || "N/A"}\n`;
      }
      formattedText += "\n";
    }

    return formattedText;
  };

  // Function to create DOCX document
  const createDocxDocument = (data) => {
    if (!data || !data.document_payload) {
      throw new Error("No report data available.");
    }

    const report = data.document_payload["System Impact Analysis Report"];
    const children = [];

    // Title
    children.push(
      new Paragraph({
        text: "System Impact Analysis Report",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400, before: 400 },
      })
    );

    // Process each section
    for (const [sectionKey, sectionData] of Object.entries(report)) {
      // Section heading
      children.push(
        new Paragraph({
          text: sectionKey,
          heading: HeadingLevel.HEADING_2,
          spacing: { after: 200, before: 300 },
        })
      );

      if (typeof sectionData === "object" && sectionData !== null) {
        // Handle nested objects
        for (const [key, value] of Object.entries(sectionData)) {
          if (typeof value === "object" && value !== null && !Array.isArray(value)) {
            // Sub-section heading
            children.push(
              new Paragraph({
                text: key,
                heading: HeadingLevel.HEADING_3,
                spacing: { after: 150, before: 200 },
              })
            );
            
            // Process nested data
            for (const [nestedKey, nestedValue] of Object.entries(value)) {
              children.push(
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `${nestedKey}: `,
                      bold: true,
                    }),
                    new TextRun({
                      text: nestedValue || "N/A",
                    }),
                  ],
                  spacing: { after: 100 },
                })
              );
            }
          } else {
            // Simple key-value pair
            children.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: `${key}: `,
                    bold: true,
                  }),
                  new TextRun({
                    text: value || "N/A",
                  }),
                ],
                spacing: { after: 100 },
              })
            );
          }
        }
      } else {
        // Simple text content
        children.push(
          new Paragraph({
            text: sectionData || "N/A",
            spacing: { after: 200 },
          })
        );
      }
    }

    return new Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });
  };

  const handleDownload = async (format) => {
    setDownloading(true);
    setDownloadStatus(null);
    
    try {
      if (!reportData) {
        throw new Error("No report data available for download.");
      }

      let blob;
      let filename;

      switch (format.toLowerCase()) {
        case "docx":
          const doc = createDocxDocument(reportData);
          blob = await Packer.toBlob(doc);
          filename = "System_Impact_Analysis_Report.docx";
          break;

        case "txt":
          const textContent = formatReportData(reportData);
          blob = new Blob([textContent], { type: "text/plain" });
          filename = "System_Impact_Analysis_Report.txt";
          break;

        case "pdf":
          // For PDF, we'll create a simple HTML-based PDF
          const htmlContent = `
            <html>
              <head>
                <style>
                  body { font-family: Arial, sans-serif; margin: 40px; }
                  h1 { color: #2c5364; text-align: center; }
                  h2 { color: #2c5364; border-bottom: 2px solid #00eaff; padding-bottom: 5px; }
                  h3 { color: #2c5364; }
                  .section { margin-bottom: 20px; }
                  .key { font-weight: bold; }
                </style>
              </head>
              <body>
                <h1>System Impact Analysis Report</h1>
                ${formatReportDataToHTML(reportData)}
              </body>
            </html>
          `;
          blob = new Blob([htmlContent], { type: "text/html" });
          filename = "System_Impact_Analysis_Report.html"; // We'll save as HTML for now
          break;

        default:
          throw new Error(`Unsupported format: ${format}`);
      }

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadStatus({
        type: "success",
        message: `${format.toUpperCase()} report downloaded successfully!`,
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setDownloadStatus(null);
        setDownloading(false);
        setOpen(false);
      }, 3000);
      
    } catch (error) {
      console.error("Download error:", error);
      setDownloadStatus({
        type: "error",
        message: `Failed to download report: ${error.message}`,
      });
      setDownloading(false);
    }
  };

  // Helper function to format data for HTML
  const formatReportDataToHTML = (data) => {
    if (!data || !data.document_payload) {
      return "<p>No report data available.</p>";
    }

    const report = data.document_payload["System Impact Analysis Report"];
    let html = "";

    const formatNestedObjectToHTML = (obj, level = 0) => {
      let htmlContent = "";
      
      for (const [key, value] of Object.entries(obj)) {
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          htmlContent += `<h${Math.min(level + 3, 6)}>${key}</h${Math.min(level + 3, 6)}>`;
          htmlContent += formatNestedObjectToHTML(value, level + 1);
        } else {
          htmlContent += `<p><span class="key">${key}:</span> ${value || "N/A"}</p>`;
        }
      }
      return htmlContent;
    };

    for (const [sectionKey, sectionData] of Object.entries(report)) {
      html += `<div class="section">`;
      html += `<h2>${sectionKey}</h2>`;
      
      if (typeof sectionData === "object" && sectionData !== null) {
        html += formatNestedObjectToHTML(sectionData, 1);
      } else {
        html += `<p>${sectionData || "N/A"}</p>`;
      }
      html += `</div>`;
    }

    return html;
  };

  const downloadOptions = [
    {
      format: "DOCX",
      icon: <Description />,
      description: "Editable Word document with full formatting",
      color: "#2196f3",
    },
    {
      format: "TXT",
      icon: <FileDownload />,
      description: "Plain text format for easy sharing",
      color: "#4caf50",
    },
    {
      format: "PDF",
      icon: <PictureAsPdf />,
      description: "HTML format (can be converted to PDF)",
      color: "#f44336",
    },
  ];

  return (
    <>
      <Tooltip title="Download Report" placement="left">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Fab
            color="primary"
            onClick={() => setOpen(true)}
            disabled={!reportData}
            sx={{
              background: reportData 
                ? "linear-gradient(45deg, #00eaff, #7f53ac)" 
                : "rgba(255,255,255,0.2)",
              color: "#fff",
              boxShadow: reportData 
                ? "0 4px 20px rgba(0,234,255,0.3)" 
                : "none",
              "&:hover": reportData ? {
                background: "linear-gradient(45deg, #00d4e6, #6a4a9a)",
                boxShadow: "0 6px 25px rgba(0,234,255,0.4)",
              } : {},
              "&:disabled": {
                background: "rgba(255,255,255,0.2)",
                color: "rgba(255,255,255,0.5)",
              },
            }}
          >
            <Download />
          </Fab>
        </motion.div>
      </Tooltip>

      <Dialog
        open={open}
        onClose={() => !downloading && setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 3,
          },
        }}
      >
        <DialogTitle sx={{ color: "#fff", display: "flex", alignItems: "center", gap: 1 }}>
          <Download sx={{ color: "#00eaff" }} />
          Download System Impact Report
        </DialogTitle>
        
        <DialogContent>
          {!reportData && (
            <Alert severity="warning" sx={{ mb: 2, background: "rgba(255,193,7,0.1)", color: "#ffc107" }}>
              No report data available. Please complete the analysis first.
            </Alert>
          )}
          
          {downloadStatus ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {downloadStatus.type === "success" ? (
                    <CheckCircle sx={{ fontSize: 64, color: "#4caf50", mb: 2 }} />
                  ) : (
                    <Error sx={{ fontSize: 64, color: "#f44336", mb: 2 }} />
                  )}
                  <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
                    {downloadStatus.type === "success" ? "Success!" : "Error"}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    {downloadStatus.message}
                  </Typography>
                </motion.div>
              </AnimatePresence>
            </Box>
          ) : (
            <Box sx={{ py: 2 }}>
              <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mb: 3 }}>
                Choose your preferred format to download the System Impact Report:
              </Typography>
              
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {downloadOptions.map((option) => (
                  <motion.div
                    key={option.format}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={option.icon}
                      onClick={() => handleDownload(option.format)}
                      disabled={downloading || !reportData}
                      sx={{
                        borderColor: option.color,
                        color: option.color,
                        background: "rgba(255,255,255,0.05)",
                        backdropFilter: "blur(10px)",
                        p: 2,
                        justifyContent: "flex-start",
                        textTransform: "none",
                        "&:hover": {
                          borderColor: option.color,
                          background: `${option.color}15`,
                        },
                        "&:disabled": {
                          borderColor: "rgba(255,255,255,0.3)",
                          color: "rgba(255,255,255,0.5)",
                        },
                      }}
                    >
                      <Box sx={{ textAlign: "left" }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {option.format}
                        </Typography>
                        <Typography variant="caption" sx={{ opacity: 0.8 }}>
                          {option.description}
                        </Typography>
                      </Box>
                    </Button>
                  </motion.div>
                ))}
              </Box>
              
              {downloading && (
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mt: 3 }}>
                  <CircularProgress size={24} sx={{ color: "#00eaff", mr: 2 }} />
                  <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)" }}>
                    Preparing download...
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={downloading}
            sx={{
              color: "rgba(255,255,255,0.7)",
              "&:hover": {
                color: "#fff",
                background: "rgba(255,255,255,0.1)",
              },
            }}
          >
            {downloadStatus ? "Close" : "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DownloadButton;

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sheets = [
  {
    name: "O2D - Packaging",
    data: `5/9/2025 18:39:01\tParminder Kaur \t8146224134\tRequirement for weeding box\tPhone
5/10/2025 15:52:54\tVruti Bhansali Mardia \t9898437067\t"Customer requirement:-\n1. Hampers\n\t12 clothing box making not possible`
  },
  {
    name: "Purchase - FMS",
    data: `5/15/2025 11:57:49\tSwaran singh\t9855134479\t"Customer requirement:-\nBattery boxes"\tJUST DAIL\t\t\tNEED FEW BOXES FOR NEW BUSINESS.`
  },
  {
    name: "IT Complaint FMS Sheet",
    url: `https://script.google.com/macros/s/AKfycbzFZq0qZziOqG_plfHUy6Ba7YL-KlE1bxwuiN4TZnerenOZUaQZpKdwgsGhgw5d-47c/exec?=IT Complaint FMS Sheet`
  },
  {
    name: "Leave Request Form",
    data: `Data for Leave Request Form`
  },
  {
    name: "IMS - BOARD",
    data: `Data for IMS - BOARD`
  },
  {
    name: "IMS - BOARD ultimate",
    data: `Data for IMS - BOARD ultimate`
  },
  {
    name: "STAFF COMPLAINT",
    data: `Data for STAFF COMPLAINT`
  },
  {
    name: "PMS Sheet",
    data: `Data for PMS Sheet`
  },
  {
    name: "System Creation",
    data: `Data for System Creation`
  },
  {
    name: "Sales Update SWEET Dashboard",
    data: `Data for Sales Update SWEET Dashboard`
  },
  {
    name: "Checklist",
    data: `Data for Checklist`
  },
  {
    name: "Sales Update FMS Dashboard",
    data: `Data for Sales Update FMS Dashboard`
  },
  {
    name: "O2D SWEETS FMS",
    data: `Data for O2D SWEETS FMS`
  },
  {
    name: "O2D-FMS Sheet (U2)",
    data: `Data for O2D-FMS Sheet (U2)`
  },
  {
    name: "MDF DEPARTMENT FMS Sheet",
    data: `Data for MDF DEPARTMENT FMS Sheet`
  },
  {
    name: "Requirement form Customer",
    url: `https://script.google.com/macros/s/AKfycbzturVNJ1z2ABj-1QwVNukjwIswxY_becPhQS4KWWpMXdBBynhpWqJxHbNAromaQdGk/exec`
  },
  {
    name: "Shop-FMS Sheet",
    url: `https://script.google.com/macros/s/AKfycbyKT10mHAFmdGI_hwzKNsREbKT8Hce0qrzn5Po1Ysg15XWr0rcTNM4J2rcgRqQtDqk/exec?sheet=Shop-FMS`
  },
  {
    name: "Marketing Activity",
    url: "https://script.google.com/macros/s/AKfycbyKT10mHAFmdGI_hwzKNsREbKT8Hce0qrzn5Po1Ysg15XWr0rcTNM4J2rcgRqQtDqk/exec?sheet=Marketing Activity",
  }
];

const rowColors = [
  "#DBEAFE", "#E9D5FF", "#D1FAE5", "#FEF3C7", "#FBCFE8", "#FFEDD5", "#FECACA"
];

export default function App() {
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [loadingSheetName, setLoadingSheetName] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sortAsc, setSortAsc] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHalfscreen, setIsHalfscreen] = useState(false);

  const handleAccess = async (sheet) => {
    setSelectedSheet(null);
    setIsFullscreen(false);
    setIsHalfscreen(false);
    if (sheet.url) {
      setLoadingSheetName(sheet.name);
      try {
        const res = await fetch(sheet.url);
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        setSelectedSheet({ name: sheet.name, data: json });
      } catch (error) {
        setSelectedSheet({ name: sheet.name, data: "Error fetching data: " + error.message });
      } finally {
        setLoadingSheetName(null);
      }
    } else {
      setSelectedSheet(sheet);
    }
  };

  const parseTSVData = (data) => {
    if (!data || typeof data !== "string") return null;
    const rows = data.trim().split("\n");
    const tableData = rows.map(row => row.split("\t").map(cell => cell.trim()));
    return tableData;
  };

  const isTSVData = (data) => {
    if (!data || typeof data !== "string") return false;
    const rows = data.trim().split("\n");
    return rows.every(row => row.includes("\t"));
  };

  const parseJSONData = (data) => {
    if (!Array.isArray(data)) return null;
    if (data.length === 0) return [];
    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => item[header] || ""));
    return [headers, ...rows];
  };

  const canDisplayAsTable = (data) => {
    if (isTSVData(data)) return true;
    if (Array.isArray(data)) return true;
    return false;
  };

  const getTableData = (data) => {
    if (isTSVData(data)) return parseTSVData(data);
    if (Array.isArray(data)) return parseJSONData(data);
    return null;
  };

  const filteredSheets = sheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedSheets = [...filteredSheets].sort((a, b) => {
    if (a.name < b.name) return sortAsc ? -1 : 1;
    if (a.name > b.name) return sortAsc ? 1 : -1;
    return 0;
  });

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setSelectedSheet(null);
        setIsFullscreen(false);
        setIsHalfscreen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

const handleDownload = () => {
    if (!selectedSheet) return;
    const element = document.createElement("a");
    const file = new Blob([selectedSheet.data], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedSheet.name.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

const handleCopyToClipboard = () => {
    if (!selectedSheet) return alert("No sheet selected to copy.");
    navigator.clipboard.writeText(selectedSheet.data)
      .then(() => alert("Sheet data copied to clipboard!"))
      .catch(() => alert("Failed to copy data."));
  };

  const copySheetName = () => {
    if (!selectedSheet) return alert("No sheet selected.");
    navigator.clipboard.writeText(selectedSheet.name)
      .then(() => alert("Sheet name copied to clipboard!"))
      .catch(() => alert("Failed to copy sheet name."));
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      setIsFullscreen(false);
      setIsHalfscreen(false);
    } else {
      setIsFullscreen(true);
    }
  };

  const toggleHalfscreen = () => {
    setIsHalfscreen(!isHalfscreen);
  };

  return (
    <>
      <style>{`
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          margin: 0; padding: 0;
        }

        .container {
          min-height: 100vh;
          padding: 24px;
          background: linear-gradient(to right, #eff6ff, #ede9fe);
          color: #1e293b;
        }

        .container.dark {
          background: #0f172a;
          color: #e2e8f0;
        }

        .header {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e40af;
          text-align: center;
          margin-bottom: 24px;
        }

        .container.dark .header {
          color: #c4b5fd;
        }

        .search-box {
          display: flex;
          justify-content: center;
          margin-bottom: 16px;
          gap: 8px;
        }

        .search-box input {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #93c5fd;
          width: 300px;
          font-size: 1rem;
        }

        .search-box button {
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid #2563eb;
          background-color: white;
          color: #2563eb;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .search-box button:hover {
          background-color: #bfdbfe;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          background-color: #1e40af;
          color: white;
          font-weight: 600;
          padding: 12px 16px;
          border-top-left-radius: 1rem;
          border-top-right-radius: 1rem;
          margin-bottom: 8px;
          align-items: center;
        }

        .container.dark .table-header {
          background-color: #4338ca;
        }

        .table-header span:first-child {
          user-select: none;
        }

        .sort-button {
          background: transparent;
          border: none;
          color: white;
          font-weight: 600;
          cursor: pointer;
          user-select: none;
        }

        .sort-button:hover {
          text-decoration: underline;
        }

        .table-body {
          border-radius: 0 0 1rem 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }

        .table-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid #d1d5db;
          transition: background-color 0.2s ease;
          gap: 24px;
          cursor: pointer;
        }

        .table-row:hover {
          background-color: rgba(0,0,0,0.05);
        }

        .sheet-name {
          font-weight: 500;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 65%;
          user-select: text;
        }

        .container.dark .sheet-name {
          color: #f1f5f9;
        }

        .sheet-access-btn {
          background-color: #2563eb;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
          white-space: nowrap;
        }

        .sheet-access-btn:hover {
          background-color: #1e40af;
        }

        .container.dark .sheet-access-btn {
          background-color: #4338ca;
        }

        .container.dark .sheet-access-btn:hover {
          background-color: #3730a3;
        }

        .popup {
          position: fixed;
          top: 10vh;
          left: 50%;
          transform: translateX(-50%);
          max-width: 900px;
          max-height: 80vh;
          overflow-y: auto;
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
          z-index: 1000;
          outline: none;
        }

        .popup.fullscreen {
          top: 0;
          left: 0;
          transform: none;
          width: 100vw;
          height: 100vh;
          border-radius: 0;
          max-height: none;
          overflow: auto;
        }

        .popup.halfscreen {
          width: 100vw;
          height: 50vh;
          top: auto;
          bottom: 0;
          left: 0;
          transform: none;
          border-radius: 0;
          max-height: none;
          overflow: auto;
        }

        .popup pre {
          white-space: pre-wrap;
          font-family: monospace;
          background: #f3f4f6;
          padding: 16px;
          border-radius: 8px;
          max-height: 60vh;
          overflow-y: auto;
          margin-bottom: 16px;
          color: #111827;
        }

        .container.dark .popup pre {
          background: #334155;
          color: #e2e8f0;
        }

        .popup-table {
          width: 100%;
          border-collapse: collapse;
          background: #f3f4f6;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
          max-height: 60vh;
          overflow-y: auto;
          border: 2px solid #d1d5db;
        }

        .container.dark .popup-table {
          background: #334155;
          border: 2px solid #4b5563;
        }

        .popup-table th,
        .popup-table td {
          padding: 12px;
          border: 1px solid #d1d5db;
          text-align: left;
          font-size: 0.9rem;
          color: #111827;
        }

        .container.dark .popup-table th,
        .container.dark .popup-table td {
          border: 1px solid #4b5563;
          color: #e2e8f0;
        }

        .popup-table th {
          background: #e5e7eb;
          font-weight: 600;
        }

        .container.dark .popup-table th {
          background: #4b5563;
        }

        .popup-table tr:nth-child(even) {
          background: #e5e7eb;
        }

        .container.dark .popup-table tr:nth-child(even) {
          background: #475569;
        }

        .popup-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }

        .popup-buttons button {
          padding: 10px 18px;
          border: none;
          border-radius: 8px;
          background-color: #2563eb;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .popup-buttons button:hover {
          background-color: #1e40af;
        }

        .container.dark .popup-buttons button {
          background-color: #4338ca;
        }

        .container.dark .popup-buttons button:hover {
          background-color: #3730a3;
        }

        .footer {
          margin-top: 48px;
          text-align: center;
          color: #64748b;
          font-size: 0.9rem;
          user-select: none;
        }

        .container.dark .footer {
          color: #94a3b8;
        }
      `}</style>

      <div className={`container ${darkMode ? "dark" : ""}`}>
        <h1 className="header">Sheet Dashboard</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search sheet name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={clearSearch}>Clear</button>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        <div className="table-header">
          <span>Sheet Name</span>
          <button
            className="sort-button"
            onClick={() => setSortAsc(!sortAsc)}
            aria-label="Toggle sort order"
          >
            Sort {sortAsc ? "▲" : "▼"}
          </button>
        </div>

        <div className="table-body" role="list" aria-label="List of sheets">
          {sortedSheets.length === 0 ? (
            <p style={{ padding: 16 }}>No sheets found.</p>
          ) : (
            sortedSheets.map((sheet, index) => (
              <div
                key={sheet.name}
                className="table-row"
                style={{ backgroundColor: rowColors[index % rowColors.length] }}
                role="listitem"
                tabIndex={0}
                onClick={() => handleAccess(sheet)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleAccess(sheet);
                  }
                }}
                aria-label={`Access sheet named ${sheet.name}`}
              >
                <span className="sheet-name">{sheet.name}</span>
                <button
                  className="sheet-access-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAccess(sheet);
                  }}
                >
                  Access
                </button>
              </div>
            ))
          )}
        </div>

        <AnimatePresence>
          {(selectedSheet || loadingSheetName) && (
            <motion.div
              className={`popup ${isFullscreen ? (isHalfscreen ? "halfscreen" : "fullscreen") : ""} ${darkMode ? "dark" : ""}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setSelectedSheet(null);
                  setIsFullscreen(false);
                  setIsHalfscreen(false);
                }
              }}
              aria-modal="true"
              role="dialog"
              aria-labelledby="popup-title"
            >
              <h2 id="popup-title" style={{ marginTop: 0, marginBottom: 8 }}>
                {loadingSheetName
                  ? `Loading "${loadingSheetName}"...`
                  : selectedSheet?.name}
              </h2>
              {loadingSheetName ? (
                <pre>Fetching data, please wait...</pre>
              ) : canDisplayAsTable(selectedSheet?.data) ? (
                <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                  <table className="popup-table">
                    <thead>
                      <tr>
                        {getTableData(selectedSheet.data)[0].map((header, index) => (
                          <th key={index}>{header || `Column ${index + 1}`}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getTableData(selectedSheet.data).slice(1).map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <pre>{typeof selectedSheet?.data === "string" ? selectedSheet.data : JSON.stringify(selectedSheet.data, null, 2)}</pre>
              )}

              {!loadingSheetName && selectedSheet && (
                <div className="popup-buttons">
                  <button onClick={handleDownload}>Download</button>
                  <button onClick={handleCopyToClipboard}>Copy Data</button>
                  <button onClick={copySheetName}>Copy Sheet Name</button>
                  <button onClick={toggleFullscreen}>
                    {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                  </button>
                  {isFullscreen && (
                    <button onClick={toggleHalfscreen}>
                      {isHalfscreen ? "Fullscreen" : "Halfscreen"}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedSheet(null);
                      setIsFullscreen(false);
                      setIsHalfscreen(false);
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="footer">
          © 2025 Your Company Name. All rights reserved.
        </footer>
      </div>
    </>
  );
}
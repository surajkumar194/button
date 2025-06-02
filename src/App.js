import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";


const sheets = [
  {
    name: "O2D - Packaging",
    data: `5/9/2025 18:39:01\tParminder Kaur \t8146224134\tRequirement for weeding box\tPhone
5/10/2025 15:52:54\tVruti Bhansali Mardia \t9898437067\t"Customer requirement:-
1. Hampers
\t12 clothing box making not possible`
  },
  {
    name: "Purchase - FMS",
    data: `5/15/2025 11:57:49\tSwaran singh\t9855134479\t"Customer requirement:-
Battery boxes"\tJUST DAIL\t\t\tNEED FEW BOXES FOR NEW BUSINESS.`
  },
  {
    name: "IT Complaint FMS Sheet",
    data: `Data for IT Complaint FMS Sheet`
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

  const handleAccess = async (sheet) => {
    setSelectedSheet(null);
    if (sheet.url) {
      setLoadingSheetName(sheet.name);
      try {
        const res = await fetch(sheet.url);
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        const formattedData = typeof json === "string" ? json : JSON.stringify(json, null, 2);
        setSelectedSheet({ name: sheet.name, data: formattedData });
      } catch (error) {
        setSelectedSheet({ name: sheet.name, data: "Error fetching data: " + error.message });
      } finally {
        setLoadingSheetName(null);
      }
    } else {
      setSelectedSheet(sheet);
    }
  };

  const filteredSheets = sheets.filter(sheet =>
    sheet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelectedSheet(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleDownload = () => {
    if (!selectedSheet) return;
    const quantity = Number(prompt("Enter quantity to download:", "1"));
    if (!quantity || quantity < 1) return alert("Quantity should be at least 1");

    for (let i = 1; i <= quantity; i++) {
      const element = document.createElement("a");
      const file = new Blob([selectedSheet.data], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${selectedSheet.name.replace(/\s+/g, "_")}_copy${i}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
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
        }

        .search-box input {
          padding: 8px 12px;
          border-radius: 8px;
          border: 1px solid #93c5fd;
          width: 300px;
          font-size: 1rem;
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
        }

        .container.dark .sheet-name {
          color: #f1f5f9;
        }

        .access-button {
          padding: 8px 24px;
          border: 1.5px solid #3b82f6;
          border-radius: 0.5rem;
          background-color: white;
          color: #2563eb;
          cursor: pointer;
          white-space: nowrap;
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }

        .access-button:hover {
          background-color: #bfdbfe;
          box-shadow: 0 4px 12px rgba(59,130,246,0.3);
        }

        .container.dark .access-button {
          background-color: #1e40af;
          color: white;
        }

        .popup {
          position: fixed;
          bottom: 20px;
          right: 20px;
          max-width: 1200px;
          max-height: 80vh;
          overflow-y: auto;
          background: white;
          padding: 24px;
          border-radius: 1rem;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
          border: 1px solid #93c5fd;
          z-index: 1000;
          white-space: pre-wrap;
          font-family: monospace;
          font-size: 0.875rem;
          color: #374151;
        }

        .container.dark .popup {
          background: #1e293b;
          color: #f1f5f9;
          border-color: #334155;
        }

        .popup h2 {
          font-weight: 700;
          font-size: 1.125rem;
          margin-bottom: 12px;
          color: #7c3aed;
        }

        .container.dark .popup h2 {
          color: #c084fc;
        }

        .popup button {
          margin-top: 16px;
          padding: 8px 16px;
          border-radius: 0.5rem;
          background: linear-gradient(to right, #7c3aed, #2563eb);
          color: white;
          border: none;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.3s ease;
          margin-right: 12px;
        }

        .popup button:hover {
          background: linear-gradient(to right, #6b21a8, #1e40af);
        }

        .loading-text {
          color: #2563eb;
          font-weight: 600;
          margin-left: 8px;
        }
      `}</style>

      <div className={`container ${darkMode ? "dark" : ""}`}>
        <h1 className="header">Sheet Dashboard</h1>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search sheet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </button>
        </div>

        <div className="table-header">
          <span>Sheet Name</span>
          <span>Action</span>
        </div>

        <div className="table-body">
          {filteredSheets.map((sheet, i) => (
            <div
              key={i}
              className="table-row"
              style={{ backgroundColor: rowColors[i % rowColors.length] }}
            >
              <span className="sheet-name" title={sheet.name}>
                {sheet.name}
              </span>
              <button
                className="access-button"
                onClick={() => handleAccess(sheet)}
                disabled={!!loadingSheetName}
              >
                Access Link
              </button>
              {loadingSheetName === sheet.name && (
                <span className="loading-text">Loading...</span>
              )}
            </div>
          ))}
        </div>

        <AnimatePresence>
          {selectedSheet && (
            <motion.div
              className="popup"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
            >
              <h2>{selectedSheet.name} Data</h2>
              <div style={{ overflowX: "auto" }}>
                {(() => {
                  try {
                    const parsed = JSON.parse(selectedSheet.data);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                      return (
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr style={{ backgroundColor: "#e0e7ff" }}>
                              {Object.keys(parsed[0]).map((key) => (
                                <th
                                  key={key}
                                  style={{
                                    padding: "8px",
                                    border: "1px solid #cbd5e1",
                                    textAlign: "left"
                                  }}
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {parsed.map((row, idx) => (
                              <tr
                                key={idx}
                                style={{
                                  backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#fff"
                                }}
                              >
                                {Object.values(row).map((val, i) => (
                                  <td
                                    key={i}
                                    style={{
                                      padding: "8px",
                                      border: "1px solid #cbd5e1"
                                    }}
                                  >
                                    {val?.toString()}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      );
                    } else {
                      return <pre>{selectedSheet.data}</pre>;
                    }
                  } catch (e) {
                    return <pre>{selectedSheet.data}</pre>;
                  }
                })()}
              </div>
              <button onClick={handleDownload}>Download</button>
              <button onClick={() => setSelectedSheet(null)}>Close</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import axios from "axios";
import "./Dashboard.css";

export default function Dashboard({ user, setUser }) {
  const [file, setFile] = useState(null);
  const [type, setType] = useState("pdf");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // ---------------- UPLOAD ----------------
  const upload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    fd.append("email", user);

    await axios.post(`http://127.0.0.1:8000/upload/${type}`, fd);
    loadHistory();
  };

  // ---------------- LOAD HISTORY ----------------
  const loadHistory = async () => {
    const res = await axios.get(`http://127.0.0.1:8000/history/${user}`);
    setHistory(res.data);
  };

  // ---------------- DELETE SINGLE ITEM ----------------
  const deleteItem = async (filename) => {
    try {
      await axios.delete("http://127.0.0.1:8000/history/item", {
        params: {
          email: user,
          filename: filename,
        },
      });

      // update UI immediately
      setHistory((prev) => prev.filter((h) => h[0] !== filename));
    } catch (err) {
      console.error(err);
      alert("Failed to delete item");
    }
  };

  // ---------------- CLEAR ALL HISTORY ----------------
  const clearHistory = async () => {
    await axios.delete(`http://127.0.0.1:8000/history/${user}`);
    setHistory([]);
  };

  // ---------------- LOGOUT ----------------
  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">🔐 File Redaction System</h1>

        {/* HEADER WITH LOGOUT */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "15px",
          }}
        >
          <p className="subtitle">
            Welcome, <b>{user}</b>
          </p>

          <button
            className="btn danger small"
            onClick={logout}
            type="button"
          >
            Logout
          </button>
        </div>

        {/* FILE TYPE */}
        <div className="section">
          <label>File Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
            <option value="word">Word</option>
            <option value="excel">Excel</option>
          </select>
        </div>

        {/* FILE INPUT */}
        <div className="section">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        </div>

        <button className="btn primary" onClick={upload} type="button">
          Upload & Redact
        </button>

        <hr />

        {/* HISTORY TOGGLE */}
        <button
          className="btn secondary"
          onClick={() => setShowHistory(!showHistory)}
          type="button"
        >
          {showHistory ? "Hide Download History" : "📥 Show Download History"}
        </button>

        {/* HISTORY SECTION */}
        {showHistory && (
          <>
            <div className="history-header">
              <h3>Download History</h3>
              <button
                className="btn danger small"
                onClick={clearHistory}
                type="button"
              >
                Clear All
              </button>
            </div>

            {history.length === 0 ? (
              <p className="empty">No files processed yet</p>
            ) : (
              <ul className="history">
                {history.map((h, i) => (
                  <li key={i} className="history-item">
                    <a
                      href={`http://127.0.0.1:8000/${h[0]}`}
                      download
                      target="_blank"
                      rel="noreferrer"
                    >
                      ⬇ {h[0].split("/").pop()}
                    </a>

                    <span>{h[1]}</span>

                    <button
                      className="btn danger tiny"
                      onClick={() => deleteItem(h[0])}
                      type="button"
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}

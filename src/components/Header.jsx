import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = ({
  dbCount,
  aiReady,
  cameraSource,
  setCameraSource,
  tempIpUrl,
  setTempIpUrl,
  connectEsp32,
  refreshStream,
  currentTime,
  visitorCount,
  isBusyMode,
  setIsBusyMode,
  setIsEditingVoice,
  onReset
}) => {
  const navigate = useNavigate(); // ✅ navigation added

  return (
    <header className="header">

      {/* LEFT: Logo + Status */}
      <div className="logo-group">
        <h1>SmartGate AI</h1>

        <span className="db-badge">
          Database: {dbCount}
        </span>

        <span className={`ai-badge ${aiReady ? "green" : "red"}`}>
          {aiReady ? "AI Ready" : "AI Loading..."}
        </span>
      </div>

      {/* CENTER: Camera Source */}
      <div className="source-picker">
        <select
          value={cameraSource}
          onChange={(e) => setCameraSource(e.target.value)}
        >
          <option value="webcam">Internal Webcam</option>
          <option value="ip">ESP32 Camera</option>
        </select>

        {cameraSource === "ip" && (
          <div className="ip-controls">
            <input
              type="text"
              value={tempIpUrl}
              onChange={(e) => setTempIpUrl(e.target.value)}
              placeholder="Enter ESP32 Stream URL"
            />

            <button onClick={connectEsp32} className="btn-secondary">
              Connect
            </button>

            <button onClick={refreshStream} className="btn-reset">
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Info + Controls */}
      <div className="right-section">

        {/* Date Time Visitor */}
        <div className="datetime-box">
          <div>📅 {currentTime.toLocaleDateString()}</div>
          <div>⏰ {currentTime.toLocaleTimeString()}</div>
          <div>👥 Visitors: {visitorCount}</div>
        </div>

        {/* Controls */}
        <div className="header-controls">

          {/* ✅ NEW: Dashboard Button */}
          <button
            onClick={() => navigate("/analytics")}
            className="btn-dashboard"
          >
            📊 Dashboard
          </button>

          <button
            onClick={() => setIsBusyMode(!isBusyMode)}
            className={`btn-mode ${isBusyMode ? "busy" : "free"}`}
          >
            {isBusyMode ? "BUSY MODE" : "FREE MODE"}
          </button>

          <button
            onClick={() => setIsEditingVoice(true)}
            className="btn-secondary"
          >
            Voice Settings
          </button>

          <button
            onClick={onReset}
            className="btn-reset"
          >
            Reset UI
          </button>

        </div>
      </div>

    </header>
  );
};

export default Header;
import React from "react";
import "./HistoryPanel.css";

const HistoryPanel = ({
  history,
  activeProfile,
  setActiveProfile,
  playVoice
}) => {
  return (
    <div className="history-section">

      <h3 className="history-title">Recent Activity</h3>

      <div className="history-list">
        {history.length === 0 ? (
          <div className="history-empty">
            No recent activity
          </div>
        ) : (
          history.map((person, idx) => (
            <div
              key={idx}
              className={`history-item ${
                activeProfile?.ID === person.ID ? "active" : ""
              }`}
              onClick={() => setActiveProfile(person)}
            >
              {/* LEFT: Info */}
              <div className="student-info">
                <strong>{person.NAME}</strong>
                <span>
                  {person.STATUS} | {person.ID}
                </span>
              </div>

              {/* RIGHT: Voice Button */}
              <button
                className="btn-voice"
                onClick={(e) => {
                  e.stopPropagation(); // prevent selecting card
                  playVoice(person.NAME);
                }}
              >
                🔊
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default HistoryPanel;
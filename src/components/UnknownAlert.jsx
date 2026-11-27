import React from "react";
import "./UnknownAlert.css";

const UnknownAlert = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="alert-overlay">
      <div className="alert-card">

        <div className="alert-icon">⚠️</div>

        <h3 className="alert-title">
          Unknown Person Detected
        </h3>

        <p className="alert-text">
          A face was detected but could not be recognized.
        </p>

        <button
          onClick={onClose}
          className="btn-alert-close"
        >
          Dismiss
        </button>

      </div>
    </div>
  );
};

export default UnknownAlert;
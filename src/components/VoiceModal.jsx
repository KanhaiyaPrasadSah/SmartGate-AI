import React from "react";
import "./VoiceModal.css";

const VoiceModal = ({
  show,
  voiceConfig,
  setVoiceConfig,
  onClose
}) => {
  if (!show) return null;

  return (
    <div className="voice-overlay">
      <div className="voice-card">

        <h3 className="voice-title">Voice Settings</h3>

        {/* FREE MODE */}
        <label className="voice-label">
          Free Mode Voice
        </label>
        <textarea
          className="voice-textarea"
          value={voiceConfig.freeText}
          onChange={(e) =>
            setVoiceConfig({
              ...voiceConfig,
              freeText: e.target.value
            })
          }
          placeholder="Enter free mode message..."
        />

        {/* BUSY MODE */}
        <label className="voice-label">
          Busy Mode Voice
        </label>
        <textarea
          className="voice-textarea"
          value={voiceConfig.busyText}
          onChange={(e) =>
            setVoiceConfig({
              ...voiceConfig,
              busyText: e.target.value
            })
          }
          placeholder="Enter busy mode message..."
        />

        {/* ACTION BUTTONS */}
        <div className="voice-actions">

          <button
            className="btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="btn-save"
            onClick={onClose}
          >
            Save
          </button>

        </div>

      </div>
    </div>
  );
};

export default VoiceModal;
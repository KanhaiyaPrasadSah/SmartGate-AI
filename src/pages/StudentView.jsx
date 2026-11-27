import React, { useState, useEffect } from "react";
import "./StudentView.css";
import logo from "../gnit-logo.jpeg"; // ✅ make sure image is in same folder

/* IMAGE HANDLER */
const getBestImageUrl = (url) => {
  if (!url) return "";

  try {
    if (url.startsWith("data:image")) return url;

    if (url.includes("drive.google.com")) {
      if (url.includes("/file/d/")) {
        const id = url.split("/d/")[1].split("/")[0];
        return `https://lh3.googleusercontent.com/d/${id}`;
      }
      if (url.includes("id=")) {
        const id = url.split("id=")[1];
        return `https://lh3.googleusercontent.com/d/${id}`;
      }
    }

    return url;
  } catch {
    return url;
  }
};

const StudentView = ({ student }) => {
  const [remarks, setRemarks] = useState("");
  const [originalRemarks, setOriginalRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (student && !isEditing) {
      const initialRemarks = student.REMARKS || "";

      setRemarks(initialRemarks);
      setOriginalRemarks(initialRemarks);
      setImgError(false);

      const raw =
        student["IMAGE LINK"] ||
        student.IMAGE_LINK ||
        student.IMAGE ||
        "";

      setImageUrl(getBestImageUrl(raw));
    }
  }, [student, isEditing]);

  if (!student) {
    return (
      <div className="profile-card empty-state">
        <div className="img-container clean-image">
          <div className="placeholder-box">Scanning...</div>
        </div>
        <div className="header-text">
          <h2>Waiting for Identity...</h2>
          <p className="sub-text">Please look into the camera</p>
        </div>
      </div>
    );
  }

  const hallTicket = student.ID || "N/A";
  const name = student.NAME || "Unknown Student";
  const attendanceValue = parseFloat(student["ATTENDANCE %"]) || 0;

  const ROMAN_MAP = {
    "1-1": "I-I",
    "1-2": "I-II",
    "2-1": "II-I",
    "2-2": "II-II",
    "3-1": "III-I",
    "3-2": "III-II",
    "4-1": "IV-I",
    "4-2": "IV-II",
  };

  /* SAVE REMARKS */
  const handleSaveRemarks = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        "https://kks4u-attendance-backend.hf.space/update",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: hallTicket,
            remarks: remarks.trim(),
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Update Failed");
      }

      setMessage("Saved successfully ✅");
      setOriginalRemarks(remarks);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage("Failed to save ❌");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="profile-card fade-in">
      
      {/* HEADER WITH LOGO & DEPARTMENT */}
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <img
          src={logo}
          alt="GNIT Logo"
          style={{
            width: "100%",
            height: "auto",
            marginBottom: "4px",
          }}
        />
        {/* ADDED DEPARTMENT HEADING */}
        <div className="dept-header">
           <span className="dept-title">Department of Information Technology</span>
        </div>
      </div>

      <div className="profile-header">
        <div className="img-container clean-image">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={name}
              className="student-photo clean-fit"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="placeholder-box">No Image</div>
          )}
          <div className="status-badge student">STUDENT</div>
        </div>

        <div className="header-text">
          <h3>{name}</h3>
          <p className="sub-text">
            Hall Ticket: <strong>{hallTicket}</strong>
          </p>
          <p className="gender-field">
            Gender: <strong>{student.GENDER || "N/A"}</strong>
          </p>
          <span className="branch-tag">
            {student.BRANCH || "IT"} - {student.SECTION || "A"}
          </span>
        </div>
      </div>

      {/* INFO GRID */}
      <div className="info-grid">
        <div className="info-item">
          <label>YEAR / SEM</label>
          <span>{student["YEAR/SEM"] || "N/A"}</span>
        </div>

        <div className="info-item">
          <label>RESIDENCE</label>
          <span>{student.RESIDENCE || "N/A"}</span>
        </div>

        <div className="info-item">
          <label>ATTENDANCE</label>
          <span className={attendanceValue < 75 ? "text-danger" : "text-success"}>
            {attendanceValue}% {attendanceValue < 75 ? "⚠️" : ""}
          </span>
        </div>

        <div className="info-item">
          <label>CGPA</label>
          <span className="highlight-blue">{student.CGPA || "0.0"}</span>
        </div>

        <div className="info-item">
          <label>CONTACT</label>
          <span>{student["PHONE NO"] || "N/A"}</span>
        </div>

        <div className="info-item">
          <label>TOTAL BACKLOGS</label>
          <span>{student["NO. OF BACKLOG"] || "0"}</span>
        </div>
      </div>

      {/* EMAIL */}
      <div className="gmail-footer">
        <label>OFFICIAL GMAIL ID</label>
        <p>{student.GMAIL || "N/A"}</p>
      </div>

      <hr className="divider" />

      {/* REMARKS (Single-line Input) */}
      <div className="remarks-section">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label>Remarks</label>

          {!isEditing ? (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              ✏️ Edit
            </button>
          ) : (
            <button
              className="btn-cancel"
              onClick={() => {
                setRemarks(originalRemarks);
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <input
          type="text"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks..."
          readOnly={!isEditing}
          disabled={!isEditing}
          className="remarks-input"
        />

        {isEditing && (
          <button
            className="save-btn"
            onClick={handleSaveRemarks}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        )}

        {message && <p className="status-msg">{message}</p>}
      </div>

      <hr className="divider" />

      {/* BACKLOGS */}
      <h4 className="section-title">Semester Backlog Subjects</h4>

      <div className="backlog-container">
        {Object.keys(ROMAN_MAP).map((sem) => {
          const key = `${sem} SEM BACKLOG SUB`;
          const val = student[key];

          const hasBacklog = val && val !== "NA" && val !== "0" && val !== 0;

          return (
            <div
              key={sem}
              className={`backlog-tile ${
                hasBacklog ? "has-backlog" : "no-backlog"
              }`}
            >
              <small>{ROMAN_MAP[sem]} Sem</small>
              <div className="subject-name">{hasBacklog ? val : "NA"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentView;
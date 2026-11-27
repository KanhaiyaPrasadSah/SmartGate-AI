import React, { useState, useEffect } from "react";
import "./FacultyView.css";
import logo from "../gnit-logo.jpeg"; // ✅ make sure image is in same folder

/* ===============================
   🔥 IMAGE HANDLER
================================ */
const getBestImageUrl = (url) => {
  try {
    if (!url) return "";

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

const FacultyView = ({ data }) => {
  const [remarks, setRemarks] = useState("");
  const [originalRemarks, setOriginalRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [time, setTime] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /* 🔥 Prevent reset while editing */
  useEffect(() => {
    if (data && !isEditing) {
      const initialRemarks = data.REMARKS || "";

      setRemarks(initialRemarks);
      setOriginalRemarks(initialRemarks);
      setImgError(false);

      const raw =
        data.IMAGE_BASE64 ||
        data["IMAGE LINK"] ||
        data.IMAGE_LINK ||
        data.IMAGE ||
        data.IMG ||
        "";

      setImageUrl(getBestImageUrl(raw));
    }
  }, [data, isEditing]);

  /* TIME */
  useEffect(() => {
    const t = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).toLowerCase();

    setTime(t);
  }, []);

  if (!data) {
    return (
      <div className="profile-card empty-state">
        <div className="img-container fixed-box">
          <div className="placeholder-box">Scanning...</div>
        </div>
        <div className="header-text">
          <h2>Waiting for Faculty Identity...</h2>
          <p className="sub-text">Please look into the camera</p>
        </div>
      </div>
    );
  }

  const name = data.NAME || "Unknown Faculty";
  const employeeId = data.ID || "N/A";
  const designation = data.DESIGNATION || "Staff Member";

  /* ===============================
     💾 SAVE REMARKS
  =============================== */
  const handleSaveRemarks = async () => {
    try {
      setSaving(true);
      setMessage("");

      const response = await fetch(
        "https://kks4u-attendance-backend.hf.space/update",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: employeeId,
            remarks: remarks.trim(),
          }),
        }
      );

      const result = await response.json();
      console.log("API Response:", result);

      if (!response.ok) {
        throw new Error(result.detail || "Update Failed");
      }

      setMessage("Saved successfully ✅");
      setOriginalRemarks(remarks);
      setIsEditing(false);

    } catch (err) {
      console.error("Save Error:", err);
      setMessage("Failed to save ❌");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="profile-card faculty-theme fade-in">
      <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <img
                src={logo}
                alt="GNIT Logo"
                style={{
                  width: "100%",
                  height: "auto",
                  marginBottom: "8px",
                }}
              />
      
              
            </div>
      <div className="profile-header">

        {/* IMAGE */}
        <div className="img-container fixed-box">
          {imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={name}
              className="profile-img faculty-border full-visible"
              onError={() => setImgError(true)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="placeholder-box">No Image</div>
          )}
          <div className="status-badge faculty">FACULTY</div>
        </div>

        {/* HEADER */}
        <div className="header-text">
          <h2 className="faculty-name">{name}</h2>

          <p className="sub-text">
            Employee ID: <strong>{employeeId}</strong>
          </p>

          <p className="gender-field">
            Gender: <strong>{data.GENDER || "N/A"}</strong>
          </p>

          <div className="designation-pill">{designation}</div>
        </div>
      </div>

      {/* DETAILS */}
      <div className="faculty-info-grid">
        <div className="fac-item">
          <label>QUALIFICATION</label>
          <span>{data.QUALIFICATION || "Bachelor"}</span>
        </div>

        <div className="fac-item">
          <label>DEPARTMENT / BRANCH</label>
          <span>{data.BRANCH || "IT"}</span>
        </div>

        <div className="fac-item">
          <label>OFFICIAL EMAIL</label>
          <span className="email-text">
            {data.GMAIL || "N/A"}
          </span>
        </div>

        <div className="fac-item">
          <label>CONTACT NUMBER</label>
          <span>{data["PHONE NO"] || "N/A"}</span>
        </div>
      </div>

      {/* ===== REMARKS ===== */}
      <hr className="divider" />

      <div className="remarks-section">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label>Remarks</label>

          {!isEditing ? (
            <button
              className="btn-edit"
              onClick={() => setIsEditing(true)}
            >
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

        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Enter remarks..."
          readOnly={!isEditing}
          disabled={!isEditing}
          style={{
            background: isEditing ? "#fff" : "#f3f4f6",
            cursor: isEditing ? "text" : "not-allowed",
          }}
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

      {/* FOOTER */}
      <div className="access-footer">
        <div className="access-status">
          <span className="dot-green"></span>
          Verified Staff Member
        </div>

        <div className="timestamp">{time}</div>
      </div>
    </div>
  );
};

export default FacultyView;
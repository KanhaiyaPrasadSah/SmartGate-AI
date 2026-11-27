import React, { useState, useRef } from "react";
import "./HomePage.css";

// COMPONENTS
import Header from "../components/Header";
import CameraView from "../components/CameraView";
import HistoryPanel from "../components/HistoryPanel";
import UnknownAlert from "../components/UnknownAlert";
import VoiceModal from "../components/VoiceModal";

// PAGES
import StudentView from "./StudentView";
import FacultyView from "./FacultyView";

// HOOKS
import useClock from "../hooks/useClock";
import useFaceRecognition from "../hooks/useFaceRecognition";
import useSystemStats from "../hooks/useSystemStats";
import useVisitorAnalytics from "../hooks/useVisitorAnalytics"; // ✅ Swapped for synced counting

// SERVICES
import { logVisit } from "../services/visitorService";

// CONFIG
import { DEFAULT_IP_URL } from "../config/config";

const HomePage = () => {
  // ================= REFS =================
  const webcamRef = useRef(null);
  const ipImgRef = useRef(null);

  // ================= GLOBAL ERROR STATE =================
  const [errorMsg, setErrorMsg] = useState(null);

  // ================= STATE =================
  const [activeProfile, setActiveProfile] = useState(null);

  const [cameraSource, setCameraSource] = useState("webcam");
  const [ipUrl, setIpUrl] = useState(DEFAULT_IP_URL);
  const [tempIpUrl, setTempIpUrl] = useState(DEFAULT_IP_URL);

  const [isBusyMode, setIsBusyMode] = useState(false);
  const [isEditingVoice, setIsEditingVoice] = useState(false);

  const [voiceConfig, setVoiceConfig] = useState({
    freeText: "Welcome [name]. Access Granted.",
    busyText: "Access Denied for [name]. Please wait."
  });

  // ================= SAFE HOOKS =================
  let currentTime = new Date();
  let dbCount = 0;
  let aiReady = false;
  let visitorCount = 0;
  let refreshAnalytics = () => {}; // Helper to refresh dashboard live

  let faceBoxes = [];
  let history = [];
  let showUnknownAlert = false;
  let setShowUnknownAlertSafe = () => {};

  try {
    currentTime = useClock();
  } catch (e) {
    setErrorMsg("Clock system failed");
  }

  try {
    const stats = useSystemStats();
    dbCount = stats.dbCount;
    aiReady = stats.aiReady;
  } catch (e) {
    setErrorMsg("System stats failed");
  }

  // ✅ FEATURE MATCH: Using useVisitorAnalytics to sync counts exactly
  try {
    const analytics = useVisitorAnalytics();
    visitorCount = analytics.totalVisitors; 
    refreshAnalytics = analytics.refresh;
  } catch (e) {
    setErrorMsg("Visitor analytics hook failed");
  }

  try {
    const face = useFaceRecognition({
      webcamRef,
      ipImgRef,
      cameraSource,
      aiReady,
      setActiveProfile,
      onNewVisit: refreshAnalytics // ✅ Trigger count sync on detection
    });

    faceBoxes = face.faceBoxes || [];
    history = face.history || [];
    showUnknownAlert = face.showUnknownAlert || false;
    setShowUnknownAlertSafe = face.setShowUnknownAlert;
  } catch (e) {
    setErrorMsg("Face recognition failed");
  }

  // ================= SAFE FUNCTIONS =================

  const connectEsp32 = () => {
    try {
      setIpUrl(tempIpUrl);
    } catch (e) {
      setErrorMsg("Failed to connect ESP32 camera");
    }
  };

  const refreshStream = () => {
    try {
      setIpUrl(prev => prev.split("?")[0] + "?t=" + new Date().getTime());
    } catch (e) {
      setErrorMsg("Stream refresh failed");
    }
  };

  const playVoice = (name) => {
    try {
      const msg = (isBusyMode
        ? voiceConfig.busyText
        : voiceConfig.freeText
      ).replace("[name]", name);

      const utterance = new SpeechSynthesisUtterance(msg);
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      setErrorMsg("Voice system failed");
    }
  };

  const handleReset = () => {
    try {
      setActiveProfile(null);
    } catch (e) {
      setErrorMsg("Reset failed");
    }
  };

  const handleVisitorLog = async (person) => {
    try {
      if (!person) return;
      await logVisit(person);
      refreshAnalytics(); // ✅ Sync UI after manual log
    } catch (e) {
      setErrorMsg("Visitor logging failed");
    }
  };

  // ================= UI =================
  return (
    <div className="container">

      {/* 🔴 GLOBAL ERROR POPUP */}
      {errorMsg && (
        <div className="error-popup">
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)}>Close</button>
        </div>
      )}

      {/* ALERT */}
      <UnknownAlert
        show={showUnknownAlert}
        onClose={() => setShowUnknownAlertSafe(false)}
      />

      {/* VOICE MODAL */}
      <VoiceModal
        show={isEditingVoice}
        voiceConfig={voiceConfig}
        setVoiceConfig={setVoiceConfig}
        onClose={() => setIsEditingVoice(false)}
      />

      {/* HEADER */}
      <Header
        dbCount={dbCount}
        aiReady={aiReady}
        cameraSource={cameraSource}
        setCameraSource={setCameraSource}
        tempIpUrl={tempIpUrl}
        setTempIpUrl={setTempIpUrl}
        connectEsp32={connectEsp32}
        refreshStream={refreshStream}
        currentTime={currentTime}
        visitorCount={visitorCount} // ✅ This now shows the synced 3 instead of 316
        isBusyMode={isBusyMode}
        setIsBusyMode={setIsBusyMode}
        setIsEditingVoice={setIsEditingVoice}
        onReset={handleReset}
      />

      {/* MAIN */}
      <div className="layout">

        {/* LEFT */}
        <div className="left-col">

          <CameraView
            cameraSource={cameraSource}
            ipUrl={ipUrl}
            faceBoxes={faceBoxes}
            webcamRef={webcamRef}
            ipImgRef={ipImgRef}
          />

          <HistoryPanel
            history={history}
            activeProfile={activeProfile}
            setActiveProfile={setActiveProfile}
            playVoice={playVoice}
          />

        </div>

        {/* RIGHT */}
        <div className="right-col">
          {activeProfile ? (
            activeProfile.STATUS === "Faculty" ? (
              <FacultyView data={activeProfile} />
            ) : (
              <StudentView student={activeProfile} />
            )
          ) : (
            <div className="empty-state">
              <div className="scanner-animation"></div>
              <p>
                Position your face in front of the camera
                to begin identification.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default HomePage;
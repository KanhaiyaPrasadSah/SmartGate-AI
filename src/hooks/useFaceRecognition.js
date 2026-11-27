import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL, VISITOR_CONFIG } from "../config/config";

// 🔥 Updated logVisit to include timestamp
const logVisitWithTimestamp = async (person) => {
  if (!person) return;

  try {
    await axios.post(`${BACKEND_URL}/log-visit`, {
      action: "LOG_VISIT",       // mandatory for backend
      id: person.ID || person.id || "",
      name: person.NAME || person.name || "",
      sem: person.SEM || person.sem || "",
      timestamp: new Date().toISOString() // ✅ send exact timestamp
    });
    console.log("Visitor logged:", person.NAME || person.name);
  } catch (err) {
    console.error("Visitor logging failed", err);
  }
};

const useFaceRecognition = ({
  webcamRef,
  ipImgRef,
  cameraSource,
  aiReady,
  setActiveProfile
}) => {
  const [faceBoxes, setFaceBoxes] = useState([]);
  const [history, setHistory] = useState([]);
  const [showUnknownAlert, setShowUnknownAlert] = useState(false);

  // ================= 🔥 VISITOR TRACKING =================
  const [isFacePresent, setIsFacePresent] = useState(false);
  const [entryTime, setEntryTime] = useState(null);
  const [exitTimeout, setExitTimeout] = useState(null);
  const [lastDetectedPerson, setLastDetectedPerson] = useState(null);

  const MIN_DURATION = VISITOR_CONFIG.MIN_DURATION;

  // ================= IMAGE CAPTURE =================
  const captureImage = () => {
    let imageSrc = null;

    if (cameraSource === "webcam" && webcamRef.current) {
      imageSrc = webcamRef.current.getScreenshot();
    } else if (cameraSource === "ip" && ipImgRef.current) {
      const canvas = document.createElement("canvas");
      const img = ipImgRef.current;

      canvas.width = img.naturalWidth || 640;
      canvas.height = img.naturalHeight || 480;

      const ctx = canvas.getContext("2d");

      try {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        imageSrc = canvas.toDataURL("image/jpeg");
      } catch (err) {
        console.error("ESP32 stream blocked (CORS).");
      }
    }

    return imageSrc;
  };

  // ================= MAIN IDENTIFICATION =================
  const runIdentification = useCallback(async () => {
    if (!aiReady) return;

    const imageSrc = captureImage();
    if (!imageSrc) return;

    try {
      const { data } = await axios.post(`${BACKEND_URL}/verify`, {
        image: imageSrc
      });

      if (!data || !data.matches) return;

      setFaceBoxes(data.matches);

      let identifiedAny = false;
      let detectedPerson = null;

      data.matches.forEach(match => {
        if (match.identified && match.student) {
          identifiedAny = true;
          const person = match.student;
          detectedPerson = person;

          // ✅ NEW: 40 SEC LOGIC INTEGRATION
          // If the backend says this is a new session count (count === 1)
          if (match.count === 1) {
             console.log(`New session detected for ${person.NAME}. Counting...`);
             // Optional: You can trigger an immediate log here if you don't want to wait for Exit
             // logVisitWithTimestamp(person); 
          }

          // History update (Remains Same)
          setHistory(prev => {
            const isAlreadyTop =
              prev.length > 0 && (prev[0].ID === person.ID || prev[0].id === person.ID);

            return isAlreadyTop
              ? prev
              : [person, ...prev.filter(p => (p.ID || p.id) !== person.ID)].slice(0, 8);
          });

          setActiveProfile(person);
        }
      });

      // ================= 🔥 VISITOR LOGIC (MAINTAINED) =================
      const faceDetected = data.matches.length > 0;

      // ENTRY
      if (faceDetected && !isFacePresent) {
        setIsFacePresent(true);
        setEntryTime(Date.now());
        setLastDetectedPerson(detectedPerson);

        if (exitTimeout) {
          clearTimeout(exitTimeout);
          setExitTimeout(null);
        }
      }

      // EXIT
      if (!faceDetected && isFacePresent) {
        const timeout = setTimeout(async () => {
          const exitTime = Date.now();

          // Keep your logic: only log if stayed longer than MIN_DURATION
          if (entryTime && (exitTime - entryTime) >= MIN_DURATION) {
            if (lastDetectedPerson) {
              // The backend will handle the 40s check internally too,
              // but we call the log here to complete the session.
              await logVisitWithTimestamp(lastDetectedPerson); 
            }
          }

          // RESET
          setIsFacePresent(false);
          setEntryTime(null);
          setLastDetectedPerson(null);
        }, VISITOR_CONFIG.EXIT_DELAY);

        setExitTimeout(timeout);
      }

      // Unknown detection (Remains Same)
      setShowUnknownAlert(
        data.matches.length > 0 && !identifiedAny
      );

    } catch (err) {
      console.log("AI processing error...", err);
    }
    // Added exitTimeout to dependency array to ensure logic stays fresh
  }, [cameraSource, aiReady, isFacePresent, entryTime, lastDetectedPerson, exitTimeout, setActiveProfile]);

  // ================= INTERVAL =================
  useEffect(() => {
    const interval = setInterval(runIdentification, 1500);
    return () => clearInterval(interval);
  }, [runIdentification]);

  return {
    faceBoxes,
    history,
    showUnknownAlert,
    setShowUnknownAlert
  };
};

export default useFaceRecognition;
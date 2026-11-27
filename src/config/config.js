// ================= BACKEND =================

// 🔗 Main Backend URL
export const BACKEND_URL = "https://gnitit-smart-gate-ai-backend.hf.space";

//export const BACKEND_URL = "https://kks4u-attendance-backend-api.hf.space";

//export const BACKEND_URL = "https://krishnamills-backend-api.hf.space";

// 🔗 API Endpoints (centralized)
export const API_ENDPOINTS = {
  LOG_VISIT: "/log-visit",
  GET_VISITS: "/visits",
  GET_SEM_ANALYTICS: "/analytics/sem"
};


// ================= CAMERA =================

// 📡 Default ESP32 Stream URL
export const DEFAULT_IP_URL = "http://esp32cam.local:81/stream";


// ================= APP SETTINGS =================

export const APP_CONFIG = {
  FACE_DETECTION_INTERVAL: 1500, // ms
  STATS_REFRESH_INTERVAL: 5000,  // ms
  MAX_HISTORY: 8
};


// ================= VISITOR LOGIC =================

// ⏱ Minimum duration for valid visit (40 sec)
export const VISITOR_CONFIG = {
  MIN_DURATION: 40000, // 40 seconds
  EXIT_DELAY: 1000     // prevent flicker
};


// ================= ANALYTICS =================

export const ANALYTICS_CONFIG = {
  DEFAULT_RANGE: "daily",
  TOP_VISITORS_LIMIT: 30
};
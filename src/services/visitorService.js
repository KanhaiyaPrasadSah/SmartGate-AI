import axios from "axios";

const BASE_URL = "http://localhost:5000"; // change if needed

// ================= SAVE VISIT =================
export const logVisit = async (visitor) => {
  try {
    const payload = {
      ID: visitor.ID,
      NAME: visitor.NAME,
      SEM: visitor.SEM,
      timestamp: new Date().toISOString()
    };

    await axios.post(`${BASE_URL}/log-visit`, payload);

    console.log("✅ Visit logged:", payload);
  } catch (error) {
    console.error("❌ Error logging visit:", error);
  }
};
import axios from "axios";
import { BACKEND_URL } from "../config/config"; // ✅ Use your global config

// Use the dynamic URL from config, fallback to localhost if not defined
const BASE_URL = BACKEND_URL || "http://localhost:5000";

// ================= FETCH VISITS =================
/**
 * Fetches raw visitor logs based on range (daily, weekly, monthly)
 * This feeds your BarCharts and History lists.
 */
export const fetchVisits = async (range = "daily") => {
  try {
    const res = await axios.get(
      `${BASE_URL}/visits`, 
      { params: { range } } // ✅ Properly passing the range as a query param
    );

    return res.data || [];
  } catch (error) {
    console.error("❌ Error fetching visits:", error);
    return [];
  }
};

// ================= OPTIONAL: FETCH PRE-AGGREGATED =================
/**
 * Fetches analytics grouped by Semester (SEM)
 */
export const fetchSemAnalytics = async (range = "daily") => {
  try {
    const res = await axios.get(
      `${BASE_URL}/analytics/sem`,
      { params: { range } } // ✅ Properly passing the range
    );

    return res.data || {};
  } catch (error) {
    console.error("❌ Error fetching SEM analytics:", error);
    return {};
  }
};

// ================= SYNC TRIGGER (NEW HELPER) =================
/**
 * Helpful for forcing a database sync if the frontend 
 * detects a change that hasn't reflected yet.
 */
export const triggerSync = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/stats`);
    return res.data;
  } catch (error) {
    console.error("❌ Sync check failed:", error);
    return null;
  }
};
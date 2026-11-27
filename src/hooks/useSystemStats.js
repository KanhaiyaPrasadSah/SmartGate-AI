// hooks/useSystemStats.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";

const useSystemStats = () => {
  const [dbCount, setDbCount] = useState(0);
  const [aiReady, setAiReady] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/stats`);

      setDbCount(data.total_students || 0);
      setAiReady(data.ai_model_ready || false);

    } catch (err) {
      console.log("Stats unavailable...");
    }
  }, []);

  useEffect(() => {
    fetchStats(); // initial call

    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    dbCount,
    aiReady
  };
};

export default useSystemStats;
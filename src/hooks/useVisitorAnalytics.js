import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config/config";

const useVisitorAnalytics = () => {
  // ================= STATE =================
  const [range, setRange] = useState("daily");
  const [selectedSem, setSelectedSem] = useState("all");

  const [chartData, setChartData] = useState([]);
  const [topVisitors, setTopVisitors] = useState([]);
  const [trendData, setTrendData] = useState([]);

  const [totalVisitors, setTotalVisitors] = useState(0);
  const [todayVisitors, setTodayVisitors] = useState(0);
  const [activeVisitors, setActiveVisitors] = useState(0);

  // ================= FETCH =================
  const fetchAnalytics = useCallback(async () => {
    try {
      // ✅ Use dynamic range to get fresh data
      const url = `${BACKEND_URL}/visits?range=${range}`;
      const res = await axios.get(url);

      let data = res.data || [];

      // ================= TOTAL SYNC =================
      // This is the number that should be passed to your Header 
      // to replace the "316" with the actual session count.
      setTotalVisitors(data.length);

      // ================= FILTER BY SEM =================
      if (selectedSem !== "all") {
        data = data.filter((v) => (v.sem || v.SEM) === selectedSem);
      }

      // ================= TODAY COUNT =================
      const todayStr = new Date().toDateString();
      const todayCount = data.filter((v) => {
        if (!v.timestamp) return false;
        return new Date(v.timestamp).toDateString() === todayStr;
      }).length;

      setTodayVisitors(todayCount);

      // ================= AGGREGATION =================
      const semMap = {};
      const visitorMap = {};
      const dateMap = {};

      data.forEach((v) => {
        // Handle potential case differences from Google Sheets/Backend
        const sId = v.id || v.ID;
        const sName = v.name || v.NAME || "Unknown";
        const sSem = v.sem || v.SEM || "Unknown";

        // 1. SEM aggregation (Fixed for "Sem Unknown" issue)
        semMap[sSem] = (semMap[sSem] || 0) + 1;

        // 2. Visitor aggregation (For Top 30)
        if (sId) {
          if (!visitorMap[sId]) {
            visitorMap[sId] = {
              id: sId,
              name: sName,
              sem: sSem,
              count: 0
            };
          }
          visitorMap[sId].count++;
        }

        // 3. Trend aggregation (For Trend Analysis Graph)
        if (v.timestamp) {
          const dateObj = new Date(v.timestamp);
          if (!isNaN(dateObj)) {
            const dateLabel = dateObj.toLocaleDateString();
            dateMap[dateLabel] = (dateMap[dateLabel] || 0) + 1;
          }
        }
      });

      // ================= FORMAT DATA =================
      setChartData(Object.keys(semMap).map(sem => ({
        sem: sem === "Unknown" ? "Unknown" : `Sem ${sem}`,
        count: semMap[sem]
      })));

      setTrendData(Object.keys(dateMap).map(date => ({
        label: date,
        count: dateMap[date]
      })).sort((a, b) => new Date(a.label) - new Date(b.label)));

      setTopVisitors(Object.values(visitorMap)
        .sort((a, b) => b.count - a.count)
        .slice(0, 30));

      // ================= ACTIVE VISITORS =================
      // Logic: Anyone seen in the last 2 minutes is "Currently Active"
      const twoMinsAgo = Date.now() - 2 * 60 * 1000;
      const activeCount = data.filter(v => 
        v.timestamp && new Date(v.timestamp).getTime() > twoMinsAgo
      ).length;
      setActiveVisitors(activeCount);

    } catch (err) {
      console.error("❌ Analytics Fetch Error:", err);
    }
  }, [range, selectedSem]);

  // ================= EFFECT =================
  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 20000); // Refreshes every 20s
    return () => clearInterval(interval);
  }, [fetchAnalytics]);

  return {
    range,
    setRange,
    selectedSem,
    setSelectedSem,
    chartData,
    trendData,
    topVisitors,
    totalVisitors,
    todayVisitors,
    activeVisitors,
    refresh: fetchAnalytics
  };
};

export default useVisitorAnalytics;
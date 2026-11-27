import React from "react";
import "./VisitorCountDashboard.css";

// COMPONENTS
import VisitorFilterPanel from "../components/visitorCountDashboard/VisitorFilterPanel";
import VisitorStatsCard from "../components/visitorCountDashboard/VisitorStatsCard";
import TopVisitors from "../components/visitorCountDashboard/TopVisitors";
import ReportTabs from "../components/visitorCountDashboard/ReportTabs";

// CHARTS
import CustomBarChart from "../components/charts/BarChart";
import CustomLineChart from "../components/charts/LineChart";
import CustomPieChart from "../components/charts/PieChart";

// HOOK
import useVisitorAnalytics from "../hooks/useVisitorAnalytics";

const VisitorCountDashboard = () => {
  const {
    range,
    setRange,
    selectedSem,
    setSelectedSem,
    chartData,
    topVisitors,
    totalVisitors,
    todayVisitors,
    activeVisitors
  } = useVisitorAnalytics();

  return (
    <div className="dashboard-container">

      {/* HEADER */}
      <h1 className="dashboard-title">📊 Visitor Analytics Dashboard</h1>

      {/* FILTERS */}
      <ReportTabs range={range} setRange={setRange} />

      <VisitorFilterPanel
        range={range}
        setRange={setRange}
        selectedSem={selectedSem}
        setSelectedSem={setSelectedSem}
      />

      {/* STATS */}
      <VisitorStatsCard
        total={totalVisitors}
        today={todayVisitors}
        active={activeVisitors}
      />

      {/* CHARTS */}
      <div className="charts-grid">

        <div className="chart-box">
          <h3>SEM-wise Visitors</h3>
          <CustomBarChart data={chartData} />
        </div>

        <div className="chart-box">
          <h3>Trend Analysis</h3>
          <CustomLineChart data={chartData} />
        </div>

        <div className="chart-box">
          <h3>Distribution</h3>
          <CustomPieChart data={chartData.map(c => ({
            name: c.sem,
            count: c.count
          }))} />
        </div>

      </div>

      {/* TOP VISITORS */}
      <TopVisitors data={topVisitors} />

    </div>
  );
};

export default VisitorCountDashboard;
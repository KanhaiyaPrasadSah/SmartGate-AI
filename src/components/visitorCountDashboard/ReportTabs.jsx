import React from "react";

const ReportTabs = ({ range, setRange }) => {
  return (
    <div className="report-tabs">

      <button
        className={range === "daily" ? "active" : ""}
        onClick={() => setRange("daily")}
      >
        Daily
      </button>

      <button
        className={range === "weekly" ? "active" : ""}
        onClick={() => setRange("weekly")}
      >
        Weekly
      </button>

      <button
        className={range === "monthly" ? "active" : ""}
        onClick={() => setRange("monthly")}
      >
        Monthly
      </button>

    </div>
  );
};

export default ReportTabs;
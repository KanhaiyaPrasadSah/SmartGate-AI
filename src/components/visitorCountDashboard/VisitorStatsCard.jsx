import React from "react";

const VisitorStatsCard = ({ total, today, active }) => {
  return (
    <div className="stats-container">

      <div className="stats-card">
        <h3>Total Visitors</h3>
        <p>{total}</p>
      </div>

      <div className="stats-card">
        <h3>Today</h3>
        <p>{today}</p>
      </div>

      <div className="stats-card">
        <h3>Currently Active</h3>
        <p>{active}</p>
      </div>

    </div>
  );
};

export default VisitorStatsCard;
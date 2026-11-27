import React from "react";

const VisitorFilterPanel = ({
  range,
  setRange,
  selectedSem,
  setSelectedSem
}) => {
  return (
    <div className="filter-panel">

      {/* Time Range */}
      <div className="filter-group">
        <label>Report:</label>
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* SEM Filter */}
      <div className="filter-group">
        <label>Semester:</label>
        <select
          value={selectedSem}
          onChange={(e) => setSelectedSem(e.target.value)}
        >
          <option value="all">All</option>
          <option value="1">Sem 1</option>
          <option value="2">Sem 2</option>
          <option value="3">Sem 3</option>
          <option value="4">Sem 4</option>
          <option value="5">Sem 5</option>
          <option value="6">Sem 6</option>
          <option value="7">Sem 7</option>
          <option value="8">Sem 8</option>
        </select>
      </div>

    </div>
  );
};

export default VisitorFilterPanel;
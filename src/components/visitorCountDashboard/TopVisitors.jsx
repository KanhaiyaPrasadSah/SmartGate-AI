import React from "react";

const TopVisitors = ({ data = [] }) => {
  return (
    <div className="top-visitors">

      <h2>🏆 Top 30 Visitors</h2>

      {data.length === 0 ? (
        <p className="empty-text">No data available</p>
      ) : (
        <div className="visitor-list">
          {data.map((visitor, index) => (
            <div key={index} className="visitor-item">

              <div className="visitor-rank">
                #{index + 1}
              </div>

              <div className="visitor-info">
                <div className="visitor-name">
                  {visitor.name || "Unknown"}
                </div>
                <div className="visitor-id">
                  ID: {visitor.id || "-"}
                </div>
              </div>

              <div className="visitor-count">
                {visitor.count}
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default TopVisitors;
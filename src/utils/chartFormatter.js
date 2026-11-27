// ================= STUDENT BAR CHART (NEW) =================
/**
 * Groups visits by Student Name for the "Each Student Separately" Bar Graph.
 * Data comes from the /visits endpoint.
 */
export const formatStudentBarChart = (data) => {
  const studentMap = {};

  data.forEach((v) => {
    // Use Name if available, fallback to ID
    const label = v.name || v.id || "Unknown";

    if (!studentMap[label]) {
      studentMap[label] = 0;
    }

    studentMap[label]++;
  });

  return Object.keys(studentMap).map((name) => ({
    name: name,
    count: studentMap[name]
  }));
};

// ================= BAR CHART (SEM) =================
export const formatBarChart = (semMap) => {
  return Object.keys(semMap).map((sem) => ({
    sem: `Sem ${sem}`,
    count: semMap[sem]
  }));
};

// ================= PIE CHART =================
export const formatPieChart = (semMap) => {
  return Object.keys(semMap).map((sem) => ({
    name: `Sem ${sem}`,
    count: semMap[sem]
  }));
};

// ================= LINE CHART =================
export const formatLineChart = (data) => {
  const dateMap = {};

  data.forEach((v) => {
    if (!v.timestamp) return;
    
    const date = new Date(v.timestamp).toLocaleDateString();

    if (!dateMap[date]) {
      dateMap[date] = 0;
    }

    dateMap[date]++;
  });

  // Sort dates so the line chart flows correctly
  return Object.keys(dateMap)
    .sort((a, b) => new Date(a) - new Date(b))
    .map((date) => ({
      label: date,
      count: dateMap[date]
    }));
};

// ================= TOP VISITORS (HELPERS) =================
/**
 * Useful for the "Top Visitors" component in your structure.
 */
export const getTopVisitors = (data, limit = 5) => {
  const formatted = formatStudentBarChart(data);
  return formatted.sort((a, b) => b.count - a.count).slice(0, limit);
};
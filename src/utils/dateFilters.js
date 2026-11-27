// ================= DAILY =================
export const filterDaily = (data) => {
  const today = new Date().toDateString();

  return data.filter(
    (v) => new Date(v.timestamp).toDateString() === today
  );
};

// ================= WEEKLY =================
export const filterWeekly = (data) => {
  const now = new Date();
  const weekAgo = new Date();

  weekAgo.setDate(now.getDate() - 7);

  return data.filter(
    (v) => new Date(v.timestamp) >= weekAgo
  );
};

// ================= MONTHLY =================
export const filterMonthly = (data) => {
  const now = new Date();

  return data.filter((v) => {
    const d = new Date(v.timestamp);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  });
};
// ================= CONSTANT =================
export const MIN_DURATION = 40000; // 40 seconds

// ================= CHECK VALID VISIT =================
export const isValidVisit = (entryTime, exitTime) => {
  if (!entryTime || !exitTime) return false;

  return (exitTime - entryTime) >= MIN_DURATION;
};

// ================= GET TIME DIFFERENCE =================
export const getDurationInSeconds = (start, end) => {
  return Math.floor((end - start) / 1000);
};
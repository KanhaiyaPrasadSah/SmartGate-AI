import { useState, useEffect } from "react";

const useVisitorCount = () => {
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    try {
      let count = localStorage.getItem("visitorCount");

      if (count) {
        count = parseInt(count, 10) + 1;
      } else {
        count = 1;
      }

      localStorage.setItem("visitorCount", count);
      setVisitorCount(count);
    } catch (err) {
      console.error("LocalStorage not available", err);
      setVisitorCount(0);
    }
  }, []);

  return visitorCount;
};

export default useVisitorCount;
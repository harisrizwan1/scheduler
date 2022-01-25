import { useState } from "react";

const useVisualMode = (initial) => {
  const [history, setHistory] = useState([initial]);

  const transition = (update, replace = false) => {
    if (replace) {
      // setHistory(prev => [...prev].splice(-1, 1, update));
      setHistory((prev) => {
        const newHistory = [...prev].slice(0, -1);
        newHistory.push(update);
        return newHistory;
      });
    } else {
      setHistory((prev) => [...prev, update]);
    }
  };

  const back = () => {
    if (history.length > 1) {
      setHistory((prev) => [...prev].slice(0, -1));
    }
  };

  const mode = history.slice(-1)[0];
  return { mode, transition, back };
};

export default useVisualMode;

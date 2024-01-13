import React, { useEffect, useState } from "react";

const ProgressBar = ({ max }) => {
  const [remainingTime, setRemainingTime] = useState(max);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <progress value={remainingTime} max={max} />;
};

export default ProgressBar;

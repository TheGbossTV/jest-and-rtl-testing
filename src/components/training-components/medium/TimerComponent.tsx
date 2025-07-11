import React, { useState, useEffect, useRef } from "react";

interface TimerComponentProps {
  initialTime?: number;
  onTimeUp?: () => void;
  onTick?: (timeLeft: number) => void;
  autoStart?: boolean;
}

const TimerComponent: React.FC<TimerComponentProps> = ({
  initialTime = 60,
  onTimeUp,
  onTick,
  autoStart = false,
}) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          onTick?.(newTime);

          if (newTime <= 0) {
            setIsRunning(false);
            setIsComplete(true);
            onTimeUp?.();
          }

          return newTime;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, onTick, onTimeUp]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleStart = () => {
    if (isComplete) {
      setTimeLeft(initialTime);
      setIsComplete(false);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(initialTime);
    setIsComplete(false);
  };

  const getTimerStatus = () => {
    if (isComplete) return "completed";
    if (isRunning) return "running";
    return "paused";
  };

  return (
    <div className="timer-container" data-testid="timer-component">
      <div
        className={`timer-display ${getTimerStatus()}`}
        data-testid="timer-display"
      >
        {formatTime(timeLeft)}
      </div>

      <div className="timer-status" data-testid="timer-status">
        Status: {getTimerStatus()}
      </div>

      <div className="timer-controls">
        {!isRunning && !isComplete && (
          <button onClick={handleStart} data-testid="start-button">
            Start
          </button>
        )}

        {!isRunning && isComplete && (
          <button onClick={handleStart} data-testid="restart-button">
            Restart
          </button>
        )}

        {isRunning && (
          <button onClick={handlePause} data-testid="pause-button">
            Pause
          </button>
        )}

        <button onClick={handleReset} data-testid="reset-button">
          Reset
        </button>
      </div>

      {isComplete && (
        <div className="timer-complete" data-testid="timer-complete">
          Time's up!
        </div>
      )}
    </div>
  );
};

export default TimerComponent;

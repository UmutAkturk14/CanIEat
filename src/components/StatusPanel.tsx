const formatDuration = (ms: number) => {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (value: number) => String(value).padStart(2, "0");
  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

type StatusPanelProps = {
  canEat: boolean;
  eatingWindowHours: number;
  windowStart: Date;
  windowEnd: Date;
  nextWindowStart: Date;
  timeUntilEatMs: number;
  timeUntilStopMs: number;
  fastDurationHours: number;
};

const StatusPanel = ({
  canEat,
  eatingWindowHours,
  windowStart,
  windowEnd,
  nextWindowStart,
  timeUntilEatMs,
  timeUntilStopMs,
  fastDurationHours,
}: StatusPanelProps) => {
  return (
    <div className={`status ${canEat ? "status-eat" : "status-fast"}`}>
      <div className="status-main">
        <div className="status-pill">{canEat ? "You can eat" : "Fasting"}</div>
        <h1>{canEat ? "Enjoy your window" : "Hold steady"}</h1>
        <p>
          Eating window: {formatTime(windowStart)} - {formatTime(windowEnd)}
          <span className="divider">•</span>
          {eatingWindowHours}h eating / {fastDurationHours}h fasting
        </p>
      </div>
      <div className="status-metrics">
        {canEat ? (
          <div className="metric">
            <span>Time left to eat</span>
            <strong>{formatDuration(timeUntilStopMs)}</strong>
          </div>
        ) : (
          <div className="metric">
            <span>Time until you can eat</span>
            <strong>{formatDuration(timeUntilEatMs)}</strong>
          </div>
        )}
        <div className="metric ghost-metric">
          <span>Next window starts</span>
          <strong>{formatTime(nextWindowStart)}</strong>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;

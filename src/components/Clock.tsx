type ClockProps = {
  now: Date;
};

const Clock = ({ now }: ClockProps) => {
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const date = now.toLocaleDateString([], {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="clock">
      <div className="clock-label">Current time</div>
      <div className="clock-time">{time}</div>
      <div className="clock-date">{date}</div>
    </div>
  );
};

export default Clock;

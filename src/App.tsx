import { useEffect, useMemo, useState } from "react";
import Clock from "./components/Clock";
import DurationSelector from "./components/DurationSelector";
import StatusPanel from "./components/StatusPanel";
import WindowStartSelector from "./components/WindowStartSelector";
import "./App.css";

const DEFAULT_FAST_DURATION = 16;
const DEFAULT_WINDOW_START = "12:00";
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const useLocalStorageNumber = (key: string, fallback: number) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    const parsed = stored ? Number.parseInt(stored, 10) : NaN;
    return Number.isNaN(parsed) ? fallback : parsed;
  });

  useEffect(() => {
    localStorage.setItem(key, String(value));
  }, [key, value]);

  return [value, setValue] as const;
};

const useLocalStorageString = (key: string, fallback: string) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ?? fallback;
  });

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};

const getWindowStart = (now: Date, windowStart: string) => {
  const [hour, minute] = windowStart.split(":").map((value) => Number(value));
  const start = new Date(now);
  start.setHours(hour || 0, minute || 0, 0, 0);
  if (now < start) {
    start.setDate(start.getDate() - 1);
  }
  return start;
};

function App() {
  const [now, setNow] = useState(() => new Date());
  const [fastDurationHours, setFastDurationHours] = useLocalStorageNumber(
    "fastDurationHours",
    DEFAULT_FAST_DURATION,
  );
  const [windowStart, setWindowStart] = useLocalStorageString(
    "eatingWindowStart",
    DEFAULT_WINDOW_START,
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const schedule = useMemo(() => {
    const eatingWindowHours = Math.max(1, 24 - fastDurationHours);
    const windowStartDate = getWindowStart(now, windowStart);
    const windowEndDate = new Date(
      windowStartDate.getTime() + eatingWindowHours * 60 * 60 * 1000,
    );
    const canEat = now >= windowStartDate && now < windowEndDate;

    let nextWindowStart = windowStartDate;
    if (canEat) {
      nextWindowStart = new Date(windowStartDate.getTime() + DAY_IN_MS);
    } else if (now >= windowStartDate) {
      nextWindowStart = new Date(windowStartDate.getTime() + DAY_IN_MS);
    }

    return {
      canEat,
      eatingWindowHours,
      windowStartDate,
      windowEndDate,
      nextWindowStart,
      timeUntilEatMs: canEat ? 0 : nextWindowStart.getTime() - now.getTime(),
      timeUntilStopMs: canEat ? windowEndDate.getTime() - now.getTime() : 0,
    };
  }, [fastDurationHours, now, windowStart]);

  return (
    <div className="app">
      <div className="layout">
        <header className="hero">
          <div>
            <p className="eyebrow">Intermittent fasting guide</p>
            <h1>Can I eat right now?</h1>
            <p className="subhead">
              Your schedule updates every second based on the fasting duration
              you choose. Everything is saved locally.
            </p>
          </div>
          <Clock now={now} />
        </header>

        <StatusPanel
          canEat={schedule.canEat}
          eatingWindowHours={schedule.eatingWindowHours}
          windowStart={schedule.windowStartDate}
          windowEnd={schedule.windowEndDate}
          nextWindowStart={schedule.nextWindowStart}
          timeUntilEatMs={schedule.timeUntilEatMs}
          timeUntilStopMs={schedule.timeUntilStopMs}
          fastDurationHours={fastDurationHours}
        />

        <div className="grid">
          <DurationSelector
            value={fastDurationHours}
            onChange={setFastDurationHours}
          />
          <WindowStartSelector value={windowStart} onChange={setWindowStart} />
        </div>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";

type DurationSelectorProps = {
  value: number;
  onChange: (nextValue: number) => void;
};

const PRESETS = [12, 14, 16, 18, 20];
const MIN_CUSTOM = 10;
const MAX_CUSTOM = 23;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const DurationSelector = ({ value, onChange }: DurationSelectorProps) => {
  const [customValue, setCustomValue] = useState(String(value));

  useEffect(() => {
    setCustomValue(String(value));
  }, [value]);

  const commitCustom = () => {
    const parsed = Number.parseInt(customValue, 10);
    if (Number.isNaN(parsed)) {
      setCustomValue(String(value));
      return;
    }
    onChange(clamp(parsed, MIN_CUSTOM, MAX_CUSTOM));
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Choose your fasting duration</h2>
        <p>Pick a preset or set a custom number of hours.</p>
      </div>
      <div className="preset-row">
        {PRESETS.map((hours) => (
          <button
            key={hours}
            type="button"
            className={`chip ${value === hours ? "chip-active" : ""}`}
            onClick={() => onChange(hours)}
          >
            {hours}h
          </button>
        ))}
      </div>
      <div className="custom-row">
        <label className="custom-label" htmlFor="custom-duration">
          Custom
        </label>
        <input
          id="custom-duration"
          type="number"
          min={MIN_CUSTOM}
          max={MAX_CUSTOM}
          value={customValue}
          onChange={(event) => setCustomValue(event.target.value)}
          onBlur={commitCustom}
        />
        <button type="button" className="ghost" onClick={commitCustom}>
          Apply
        </button>
        <span className="helper">{MIN_CUSTOM}-{MAX_CUSTOM} hours</span>
      </div>
    </div>
  );
};

export default DurationSelector;

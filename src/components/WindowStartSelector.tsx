type WindowStartSelectorProps = {
  value: string;
  onChange: (nextValue: string) => void;
};

const WindowStartSelector = ({ value, onChange }: WindowStartSelectorProps) => {
  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Eating window start</h2>
        <p>Set when your eating window begins each day.</p>
      </div>
      <div className="custom-row">
        <label className="custom-label" htmlFor="window-start">
          Start time
        </label>
        <input
          id="window-start"
          type="time"
          step={60}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="helper">Saved locally</span>
      </div>
    </div>
  );
};

export default WindowStartSelector;

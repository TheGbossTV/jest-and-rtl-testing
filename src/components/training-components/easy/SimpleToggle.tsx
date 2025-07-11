import React, { useState } from "react";

interface SimpleToggleProps {
  initialValue?: boolean;
  onToggle?: (value: boolean) => void;
  label?: string;
}

const SimpleToggle: React.FC<SimpleToggleProps> = ({
  initialValue = false,
  onToggle,
  label = "Toggle",
}) => {
  const [isToggled, setIsToggled] = useState(initialValue);

  const handleToggle = () => {
    const newValue = !isToggled;
    setIsToggled(newValue);
    onToggle?.(newValue);
  };

  return (
    <div className="toggle-container">
      <label aria-label="checkbox-label">
        <input type="checkbox" checked={isToggled} onChange={handleToggle} />
        {label}
      </label>
      <span>Status: {isToggled ? "ON" : "OFF"}</span>
    </div>
  );
};

export default SimpleToggle;

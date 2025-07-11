import React from "react";

interface SimpleButtonProps {
  text: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  text,
  onClick,
  disabled = false,
  variant = "primary",
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {text}
    </button>
  );
};

export default SimpleButton;

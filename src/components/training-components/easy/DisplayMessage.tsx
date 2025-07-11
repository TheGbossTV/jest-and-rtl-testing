import React from "react";

interface DisplayMessageProps {
  message: string;
  type?: "info" | "success" | "error" | "warning";
  showIcon?: boolean;
}

const DisplayMessage: React.FC<DisplayMessageProps> = ({
  message,
  type = "info",
  showIcon = false,
}) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✅";
      case "error":
        return "❌";
      case "warning":
        return "⚠️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className={`message message-${type}`} data-testid="display-message">
      {showIcon && (
        <span aria-label="message-icon" className="message-icon">
          {getIcon()}
        </span>
      )}
      <span className="message-text">{message}</span>
    </div>
  );
};

export default DisplayMessage;

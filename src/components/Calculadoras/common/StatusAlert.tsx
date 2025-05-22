import React from "react";

interface StatusAlertProps {
  status: string;
  type: "info" | "success" | "warning" | "danger";
}

const StatusAlert: React.FC<StatusAlertProps> = ({ status, type }) => {
  const getAlertClass = () => {
    switch (type) {
      case "info":
        return "bg-blue-500/20";
      case "success":
        return "bg-green-500/20";
      case "warning":
        return "bg-yellow-500/20";
      case "danger":
        return "bg-red-500/20";
      default:
        return "bg-blue-500/20";
    }
  };

  return (
    <div className={`alert ${getAlertClass()}`}>
      <strong>{status}</strong>
    </div>
  );
};

export default StatusAlert;

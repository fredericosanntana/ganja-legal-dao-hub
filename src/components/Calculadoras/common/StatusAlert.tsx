
import React from "react";

interface StatusAlertProps {
  status: string;
  type: "info" | "success" | "warning" | "danger";
  children?: React.ReactNode; // Added children prop
}

const StatusAlert: React.FC<StatusAlertProps> = ({ status, type, children }) => {
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
    <div className={`alert ${getAlertClass()} p-3 rounded`}>
      <strong>{status}</strong>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
};

export default StatusAlert;

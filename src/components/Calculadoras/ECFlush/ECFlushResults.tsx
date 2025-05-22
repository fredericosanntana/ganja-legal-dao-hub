import React from "react";
import StatusAlert from "../common/StatusAlert";
import RecommendationList from "../common/RecommendationList";

interface ECFlushResultsProps {
  waterVolume: number;
  flushCount: number;
  schedule: Array<{ day: number; ec: string; action: string }>;
  recommendations: { status: string; actions: string[] };
  substrateInstructions: string[];
}

const ECFlushResults: React.FC<ECFlushResultsProps> = ({
  waterVolume,
  flushCount,
  schedule,
  recommendations,
  substrateInstructions,
}) => {
  const getAlertType = () => {
    if (recommendations.status.includes("muito alta")) return "danger";
    if (recommendations.status.includes("elevada")) return "warning";
    return "success";
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{flushCount} Flushes</h2>
        <p className="text-lg mt-2">
          Volume de água: {waterVolume.toFixed(1)} litros por flush
        </p>
      </div>

      <StatusAlert status={recommendations.status} type={getAlertType()} />

      <RecommendationList recommendations={recommendations.actions} />

      <div className="space-y-2">
        <h6 className="text-lg font-medium">Cronograma de Flush:</h6>
        <ul className="list-disc pl-5 space-y-1">
          {schedule.map((item, index) => (
            <li key={index}>
              <strong>Dia {item.day}:</strong> {item.action} (EC projetada: {item.ec})
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <h6 className="text-lg font-medium">Instruções para o Substrato:</h6>
        <ul className="list-disc pl-5 space-y-1">
          {substrateInstructions.map((instruction, index) => (
            <li key={index}>{instruction}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ECFlushResults;

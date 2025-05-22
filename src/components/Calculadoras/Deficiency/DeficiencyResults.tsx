import React from "react";
import StatusAlert from "../common/StatusAlert";
import RecommendationList from "../common/RecommendationList";
import { DEFICIENCY_TYPES } from "./deficiencyUtils";

interface DeficiencyResultsProps {
  deficiencies: Array<{ nutrient: string; symptoms: string; solutions: string[] }>;
  probabilities: Record<string, number>;
  schedule: Array<{ day: number; actions: string[] }>;
  showResults: boolean;
}

const DeficiencyResults: React.FC<DeficiencyResultsProps> = ({
  deficiencies,
  probabilities,
  schedule,
  showResults,
}) => {
  if (!showResults) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">
          Selecione os sintomas observados e clique em "Identificar Deficiências" para análise.
        </p>
      </div>
    );
  }

  const getAlertType = (probability: number) => {
    if (probability > 0.7) return "danger";
    if (probability > 0.4) return "warning";
    return "info";
  };

  return (
    <div className="space-y-4">
      {deficiencies.length === 0 ? (
        <StatusAlert
          status="Nenhuma deficiência específica identificada com base nos sintomas selecionados."
          type="info"
        />
      ) : (
        <>
          <h6 className="text-lg font-medium">Deficiências Identificadas:</h6>
          {deficiencies.map((deficiency, index) => {
            const probability = probabilities[deficiency.nutrient] || 0;
            const nutrientName = DEFICIENCY_TYPES[deficiency.nutrient as keyof typeof DEFICIENCY_TYPES]?.name || deficiency.nutrient;
            
            return (
              <div key={index} className="space-y-2">
                <StatusAlert
                  status={`Deficiência de ${nutrientName} - Probabilidade: ${Math.round(probability * 100)}%`}
                  type={getAlertType(probability)}
                />
                <p className="text-sm mb-1">Sintomas: {deficiency.symptoms}</p>
                <RecommendationList
                  recommendations={deficiency.solutions}
                  title="Soluções Recomendadas:"
                />
              </div>
            );
          })}

          {schedule.length > 0 && (
            <div className="mt-4">
              <h6 className="text-lg font-medium">Cronograma de Tratamento:</h6>
              {schedule.map((item, index) => (
                <div key={index} className="mt-2">
                  <h6 className="font-medium">Dia {item.day}:</h6>
                  <RecommendationList recommendations={item.actions} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DeficiencyResults;

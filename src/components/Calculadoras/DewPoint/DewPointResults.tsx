import React from "react";
import StatusAlert from "../common/StatusAlert";
import RecommendationList from "../common/RecommendationList";

interface DewPointResultsProps {
  dewPoint: number;
  moldRisk: string;
  dryingRate: { dailyRate: number; estimatedDays: number };
  recommendations: { status: string; actions: string[] };
}

const DewPointResults: React.FC<DewPointResultsProps> = ({
  dewPoint,
  moldRisk,
  dryingRate,
  recommendations,
}) => {
  const getAlertType = () => {
    if (moldRisk === "alto") return "danger";
    if (moldRisk === "medio") return "warning";
    return "success";
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h6 className="text-lg font-medium">Ponto de Orvalho</h6>
        <h2 className="text-3xl font-bold">{dewPoint.toFixed(1)}°C</h2>
        <p className="text-sm text-muted-foreground">
          Temperatura na qual ocorre condensação
        </p>
      </div>

      <div className="space-y-2">
        <h6 className="text-lg font-medium">Risco de Mofo</h6>
        <StatusAlert
          status={
            moldRisk === "alto"
              ? "Alto"
              : moldRisk === "medio"
              ? "Médio"
              : "Baixo"
          }
          type={getAlertType()}
        />
      </div>

      <div className="space-y-2">
        <h6 className="text-lg font-medium">Taxa de Secagem</h6>
        <p className="text-lg">
          ~{dryingRate.dailyRate.toFixed(1)}% de umidade por dia
        </p>
        <p className="text-sm text-muted-foreground">
          Tempo estimado: {dryingRate.estimatedDays.toFixed(1)} dias
        </p>
      </div>

      <div className="space-y-2">
        <StatusAlert status={recommendations.status} type={getAlertType()} />
        <RecommendationList recommendations={recommendations.actions} />
      </div>
    </div>
  );
};

export default DewPointResults;

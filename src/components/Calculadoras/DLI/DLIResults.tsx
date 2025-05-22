import React from "react";
import StatusAlert from "../common/StatusAlert";
import RecommendationList from "../common/RecommendationList";
import { Progress } from "@/components/ui/progress";

interface DLIResultsProps {
  dliValue: number;
  dliZone: string;
  recommendations: { status: string; actions: string[] };
  energyValue: number;
}

const DLIResults: React.FC<DLIResultsProps> = ({
  dliValue,
  dliZone,
  recommendations,
  energyValue,
}) => {
  const getAlertType = () => {
    if (dliZone === "tooLow") return "info";
    if (dliZone === "low" || dliZone === "optimal") return "success";
    if (dliZone === "high") return "warning";
    return "danger";
  };

  // Calcular valor de progresso para a barra (0-100)
  const getProgressValue = () => {
    if (dliValue < 10) return 10;
    if (dliValue > 60) return 90;
    return ((dliValue - 10) / 50) * 80 + 10; // Mapear 10-60 para 10-90
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold">{dliValue.toFixed(1)} mol/m²/dia</h2>
        <div className="mt-4">
          <Progress value={getProgressValue()} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground mt-1">
            <span>Muito Baixo</span>
            <span>Ótimo</span>
            <span>Muito Alto</span>
          </div>
        </div>
      </div>

      <StatusAlert status={recommendations.status} type={getAlertType()} />

      <RecommendationList recommendations={recommendations.actions} />

      <div className="text-sm">
        <strong>Consumo estimado:</strong> {energyValue.toFixed(1)} kWh/dia
      </div>
    </div>
  );
};

export default DLIResults;

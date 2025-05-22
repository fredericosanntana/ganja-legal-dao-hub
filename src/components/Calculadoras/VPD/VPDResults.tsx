import React from "react";
import StatusAlert from "../common/StatusAlert";
import RecommendationList from "../common/RecommendationList";

interface VPDResultsProps {
  vpdResult: number | null;
  vpdZone: string;
  recommendations: { status: string; actions: string[] };
}

const VPDResults: React.FC<VPDResultsProps> = ({
  vpdResult,
  vpdZone,
  recommendations,
}) => {
  const getAlertType = () => {
    if (vpdZone === "tooLow") return "info";
    if (vpdZone === "low" || vpdZone === "optimal") return "success";
    if (vpdZone === "high") return "warning";
    return "danger";
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          {vpdResult !== null ? `${vpdResult.toFixed(2)} kPa` : "0.00 kPa"}
        </h2>
        <div className="relative h-8 mb-2">
          {/* Zonas de cor */}
          <div className="absolute inset-0 flex rounded-full overflow-hidden">
            <div className="w-1/5 bg-blue-400" />
            <div className="w-1/5 bg-green-300" />
            <div className="w-1/5 bg-emerald-500" />
            <div className="w-1/5 bg-yellow-400" />
            <div className="w-1/5 bg-red-500" />
          </div>

          {/* Marcador */}
          <div
            className="absolute top-0 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-transparent border-t-black"
            style={{
              left: `${((vpdResult || 0) / 3) * 100}%`,
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Labels */}
        <div className="flex justify-between text-sm font-medium">
          <span className="text-blue-600">Muito Baixo</span>
          <span className="text-green-500">Baixo</span>
          <span className="text-emerald-600">Ótimo</span>
          <span className="text-yellow-600">Alto</span>
          <span className="text-red-600">Muito Alto</span>
        </div>
      </div>

      <StatusAlert status={recommendations.status} type={getAlertType()} />

      <RecommendationList recommendations={recommendations.actions} />
    </div>
  );
};

export default VPDResults;

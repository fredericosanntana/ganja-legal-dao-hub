import React from "react";
import StatusAlert from "../common/StatusAlert";
import RecommendationList from "../common/RecommendationList";

interface NutrientsResultsProps {
  showResults: boolean;
  targetEC: number;
  resultEC: number;
  dosages: Record<string, { mlPerLiter: number; mlTotal: number }>;
  incompatibilities: string[];
  schedule: Record<string, number>;
}

const NutrientsResults: React.FC<NutrientsResultsProps> = ({
  showResults,
  targetEC,
  resultEC,
  dosages,
  incompatibilities,
  schedule,
}) => {
  if (!showResults) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">
          Clique em "Calcular Nutrientes" para gerar a tabela de dosagem.
        </p>
      </div>
    );
  }

  const getAlertType = () => {
    const diff = Math.abs(resultEC - targetEC);
    if (diff < 0.2) return "success";
    if (diff < 0.5) return "warning";
    return "danger";
  };

  return (
    <div className="space-y-4">
      <StatusAlert
        status={`EC Alvo: ${targetEC.toFixed(2)} mS/cm (${Math.round(targetEC * 500)} ppm) | EC Resultante: ${resultEC.toFixed(2)} mS/cm`}
        type={getAlertType()}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Nutriente</th>
              <th className="p-2 text-left">ml por Litro</th>
              <th className="p-2 text-left">Quantidade Total</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(dosages).map(([nutrient, info]) => (
              <tr key={nutrient} className="border-b">
                <td className="p-2">{nutrient}</td>
                <td className="p-2">{info.mlPerLiter.toFixed(1)} ml/L</td>
                <td className="p-2">{info.mlTotal.toFixed(1)} ml</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {incompatibilities.length > 0 && (
        <StatusAlert
          status="Atenção! Incompatibilidades detectadas:"
          type="warning"
        >
          <RecommendationList recommendations={incompatibilities} />
        </StatusAlert>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Semana</th>
              <th className="p-2 text-left">% da Dose</th>
              <th className="p-2 text-left">EC Alvo</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(schedule).map(([week, factor]) => (
              <tr key={week} className="border-b">
                <td className="p-2">Semana {week.replace('week', '')}</td>
                <td className="p-2">{(factor * 100).toFixed(0)}%</td>
                <td className="p-2">{(targetEC * factor).toFixed(2)} mS/cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NutrientsResults;

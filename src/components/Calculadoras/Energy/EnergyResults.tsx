import React from "react";
import StatusAlert from "../common/StatusAlert";
import RecommendationList from "../common/RecommendationList";
import { EnergyCalculationResult } from "./energyUtils";

interface EnergyResultsProps {
  showResults: boolean;
  results: EnergyCalculationResult | null;
  efficiencyTips: string[];
}

const EnergyResults: React.FC<EnergyResultsProps> = ({
  showResults,
  results,
  efficiencyTips,
}) => {
  if (!showResults || !results) {
    return (
      <div className="text-center py-4">
        <p className="text-muted">
          Adicione seus equipamentos e clique em "Calcular Consumo de Energia" para ver os resultados.
        </p>
      </div>
    );
  }

  const getConsumptionAlertType = () => {
    if (results.monthlyConsumption > 300) return "danger";
    if (results.monthlyConsumption > 150) return "warning";
    return "success";
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-muted/30 p-4 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-1">Consumo Mensal</h3>
          <p className="text-3xl font-bold">{results.monthlyConsumption.toFixed(2)} kWh</p>
        </div>
        <div className="bg-muted/30 p-4 rounded-lg text-center">
          <h3 className="text-lg font-medium mb-1">Custo Mensal</h3>
          <p className="text-3xl font-bold">R$ {results.monthlyCost.toFixed(2)}</p>
        </div>
      </div>

      <StatusAlert
        status={`Emissão de CO₂: ${results.co2Emission.toFixed(2)} kg por mês`}
        type={getConsumptionAlertType()}
      />

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Equipamento</th>
              <th className="p-2 text-right">Consumo (kWh)</th>
              <th className="p-2 text-right">Custo (R$)</th>
            </tr>
          </thead>
          <tbody>
            {results.equipmentBreakdown.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="p-2">{item.name}</td>
                <td className="p-2 text-right">{item.consumption.toFixed(2)}</td>
                <td className="p-2 text-right">{item.cost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bg-muted/20 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Dicas de Eficiência Energética</h3>
        <RecommendationList recommendations={efficiencyTips} />
      </div>
    </div>
  );
};

export default EnergyResults;

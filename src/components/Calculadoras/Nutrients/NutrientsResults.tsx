
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatusAlert from '../common/StatusAlert';
import { NutrientParams, calculateNutrients } from './nutrientsUtils';

interface NutrientsResultsProps {
  params: NutrientParams;
}

export const NutrientsResults: React.FC<NutrientsResultsProps> = ({ params }) => {
  const results = calculateNutrients(params);

  const formatValue = (value: number): string => {
    return value.toFixed(1);
  };

  const getRecommendations = () => {
    const { growthStage } = params;
    
    if (growthStage === 'seedling') {
      return [
        "Use fertilizantes com baixo teor de nitrogênio",
        "Aplique fertilizantes em quantidades reduzidas",
        "Monitore cuidadosamente para evitar queima de raízes"
      ];
    }
    else if (growthStage === 'vegetative') {
      return [
        "Aumente gradualmente o nitrogênio",
        "Mantenha níveis moderados de fósforo",
        "Aplique fertilizantes a cada rega ou em dias alternados"
      ];
    }
    else if (growthStage === 'flowering') {
      return [
        "Reduza o nitrogênio gradualmente",
        "Aumente o fósforo e potássio",
        "Considere adicionar suplementos de floração específicos"
      ];
    }
    else if (growthStage === 'late_flowering') {
      return [
        "Reduza todos os nutrientes",
        "Prepare para o flush final",
        "Observe os tricomas para o momento ideal da colheita"
      ];
    }
    
    return [];
  };
  
  const getNutrationStatus = (): string => {
    const { nitrogen, phosphorus, potassium } = results;
    const total = nitrogen + phosphorus + potassium;
    
    if (total <= 3) return "Baixo";
    if (total <= 6) return "Moderado";
    return "Alto";
  };
  
  const nutritionStatus = getNutrationStatus();
  const statusType = 
    nutritionStatus === "Baixo" ? "warning" :
    nutritionStatus === "Moderado" ? "success" : "warning";
  
  return (
    <Card className="mt-4">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Resultados da Nutrição</h3>
        
        <StatusAlert
          status={nutritionStatus}
          type={statusType as "success" | "warning" | "error" | "info" | undefined}
        >
          <p>Nível de nutrição atual: <strong>{nutritionStatus}</strong></p>
        </StatusAlert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 border rounded-lg bg-blue-50">
            <div className="text-sm text-gray-500">Nitrogênio (N)</div>
            <div className="text-2xl font-bold">{formatValue(results.nitrogen)}</div>
          </div>
          <div className="p-3 border rounded-lg bg-red-50">
            <div className="text-sm text-gray-500">Fósforo (P)</div>
            <div className="text-2xl font-bold">{formatValue(results.phosphorus)}</div>
          </div>
          <div className="p-3 border rounded-lg bg-teal-50">
            <div className="text-sm text-gray-500">Potássio (K)</div>
            <div className="text-2xl font-bold">{formatValue(results.potassium)}</div>
          </div>
        </div>
        
        <div className="mt-6">
          <h4 className="font-medium mb-2">Recomendações</h4>
          <ul className="list-disc pl-5 space-y-1">
            {getRecommendations().map((rec, index) => (
              <li key={index} className="text-sm">{rec}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutrientsResults;

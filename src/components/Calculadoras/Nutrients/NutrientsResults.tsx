
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StatusAlert from '../common/StatusAlert';

export interface NutrientsResultsProps {
  params?: {
    growthStage: string;
    cultivarType: string;
    waterVolume: number;
    desiredEC: number;
    addMicronutrients: boolean;
  };
  // Added for compatibility with NutrientsCalculator
  showResults?: boolean;
  targetEC?: number;
  resultEC?: number;
  dosages?: Record<string, { mlPerLiter: number; mlTotal: number }>;
  incompatibilities?: string[];
  schedule?: Record<string, number>;
}

export const NutrientsResults: React.FC<NutrientsResultsProps> = ({ 
  params,
  showResults,
  targetEC,
  resultEC,
  dosages,
  incompatibilities,
  schedule
}) => {
  // If we're showing results from NutrientsCalculator, render those
  if (showResults && dosages) {
    const nutritionStatus = resultEC && resultEC > 2.0 ? "Alto" : 
                           resultEC && resultEC > 1.0 ? "Moderado" : "Baixo";
    const statusType = nutritionStatus === "Moderado" ? "success" : "warning";
    
    return (
      <Card className="mt-4">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Resultados da Nutrição</h3>
          
          <StatusAlert
            status={nutritionStatus}
            type={statusType}
          >
            <p>EC resultante: <strong>{resultEC?.toFixed(1)} mS/cm</strong></p>
          </StatusAlert>
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Dosagens</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(dosages).map(([nutrient, values]) => (
                <div key={nutrient} className="p-3 border rounded-lg bg-slate-50">
                  <div className="text-sm text-gray-500">{nutrient}</div>
                  <div className="text-xl font-bold">{values.mlTotal.toFixed(1)}ml</div>
                  <div className="text-xs text-gray-500">{values.mlPerLiter.toFixed(1)}ml/L</div>
                </div>
              ))}
            </div>
          </div>
          
          {incompatibilities && incompatibilities.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Incompatibilidades</h4>
              <ul className="list-disc pl-5 space-y-1">
                {incompatibilities.map((item, index) => (
                  <li key={index} className="text-sm text-amber-700">{item}</li>
                ))}
              </ul>
            </div>
          )}
          
          {schedule && Object.keys(schedule).length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">Programa de Alimentação</h4>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(schedule).map(([day, percent]) => (
                  <li key={day} className="text-sm">
                    {day}: {percent}% da solução
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Fall back to original functionality with params
  if (!params) return null;
  
  // Valores simulados para NPK baseados no estágio de crescimento
  let nitrogen = 0;
  let phosphorus = 0;
  let potassium = 0;
  
  switch (params.growthStage) {
    case 'seedling':
      nitrogen = 2.0;
      phosphorus = 1.0;
      potassium = 1.0;
      break;
    case 'vegetative':
      nitrogen = 3.0;
      phosphorus = 1.5;
      potassium = 2.0;
      break;
    case 'flowering':
      nitrogen = 1.5;
      phosphorus = 3.0;
      potassium = 3.0;
      break;
    case 'late_flowering':
      nitrogen = 0.5;
      phosphorus = 2.0;
      potassium = 3.5;
      break;
    default:
      nitrogen = 2.0;
      phosphorus = 2.0;
      potassium = 2.0;
  }
  
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
          type={statusType}
        >
          <p>Nível de nutrição atual: <strong>{nutritionStatus}</strong></p>
        </StatusAlert>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 border rounded-lg bg-blue-50">
            <div className="text-sm text-gray-500">Nitrogênio (N)</div>
            <div className="text-2xl font-bold">{formatValue(nitrogen)}</div>
          </div>
          <div className="p-3 border rounded-lg bg-red-50">
            <div className="text-sm text-gray-500">Fósforo (P)</div>
            <div className="text-2xl font-bold">{formatValue(phosphorus)}</div>
          </div>
          <div className="p-3 border rounded-lg bg-teal-50">
            <div className="text-sm text-gray-500">Potássio (K)</div>
            <div className="text-2xl font-bold">{formatValue(potassium)}</div>
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

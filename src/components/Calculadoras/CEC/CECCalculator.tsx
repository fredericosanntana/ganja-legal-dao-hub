import React, { useState } from "react";
import { Plant } from "lucide-react";
import CalculatorCard from "../common/CalculatorCard";
import CECParameters from "./CECParameters";
import CECResults from "./CECResults";
import CECChart from "./CECChart";
import {
  CECParameters as CECParametersType,
  CECResult,
  DEFAULT_PARAMETERS,
  calculateCECResults
} from "./CECUtils";

const CECCalculator: React.FC = () => {
  const [parameters, setParameters] = useState<CECParametersType>(DEFAULT_PARAMETERS);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [results, setResults] = useState<CECResult | null>(null);

  const updateParameter = (field: keyof CECParametersType, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    const calculationResults = calculateCECResults(parameters);
    setResults(calculationResults);
    setShowResults(true);
  };

  return (
    <CalculatorCard
      icon={Plant}
      title="Calculadora de Expectativa de Cultivo (CEC)"
      description="Estime o rendimento do seu cultivo com base em parâmetros reais e obtenha uma projeção documentada para uso jurídico e organizacional."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parâmetros */}
        <div className="space-y-4">
          <CECParameters
            parameters={parameters}
            updateParameter={updateParameter}
            handleCalculate={handleCalculate}
          />
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          <CECResults
            showResults={showResults}
            results={results}
          />
        </div>

        {/* Gráfico */}
        <div className="space-y-4 md:col-span-2">
          {showResults && results && (
            <CECChart
              showResults={showResults}
              chartData={results.chartData}
            />
          )}
          
          {showResults && (
            <div className="mt-4 bg-muted/20 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Informações Adicionais</h3>
              <p className="text-sm mb-2">
                Esta calculadora pode ajudar a:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Planejar melhor o cultivo</li>
                <li>Fornecer prova de proporcionalidade para uso pessoal</li>
                <li>Garantir que sua produção esteja dentro da razoabilidade legal</li>
                <li>Entender o impacto de cada escolha (vaso, luz, genética, nutrição)</li>
              </ul>
              
              <p className="text-sm mt-3">
                Lembre-se que o rendimento real pode variar dependendo de diversos fatores ambientais, 
                genéticos e de manejo que não podem ser completamente previstos por uma calculadora.
              </p>
            </div>
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};

export default CECCalculator;

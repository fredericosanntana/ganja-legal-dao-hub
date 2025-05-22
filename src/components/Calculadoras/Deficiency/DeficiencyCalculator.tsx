import React from "react";
import { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import CalculatorCard from "../common/CalculatorCard";
import DeficiencyParameters from "./DeficiencyParameters";
import DeficiencyResults from "./DeficiencyResults";
import DeficiencyChart from "./DeficiencyChart";
import {
  DEFICIENCY_TYPES,
  DEFICIENCY_SYMPTOMS,
  identifyDeficiencies,
  calculateDeficiencyProbability,
  generateDeficiencyChartData,
  generateRecommendationSchedule
} from "./deficiencyUtils";

const DeficiencyCalculator: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [phValue, setPHValue] = useState<number>(6.5);
  const [ecValue, setECValue] = useState<number>(1.2);
  const [growthStage, setGrowthStage] = useState<string>("vegetativo");
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const [deficiencies, setDeficiencies] = useState<Array<{ nutrient: string; symptoms: string; solutions: string[] }>>([]);
  const [probabilities, setProbabilities] = useState<Record<string, number>>({});
  const [schedule, setSchedule] = useState<Array<{ day: number; actions: string[] }>>([]);
  const [probabilityChartData, setProbabilityChartData] = useState<any>(null);

  const handleSymptomChange = (symptom: string, checked: boolean) => {
    setSelectedSymptoms(prev => 
      checked ? [...prev, symptom] : prev.filter(s => s !== symptom)
    );
  };

  const handleIdentifyDeficiencies = () => {
    if (selectedSymptoms.length === 0) {
      alert('Por favor, selecione pelo menos um sintoma.');
      return;
    }
    
    const identifiedDeficiencies = identifyDeficiencies(selectedSymptoms);
    const calculatedProbabilities = calculateDeficiencyProbability(
      selectedSymptoms,
      phValue,
      ecValue,
      growthStage
    );
    const recommendationSchedule = generateRecommendationSchedule(
      identifiedDeficiencies,
      growthStage
    );
    const chartData = generateDeficiencyChartData(calculatedProbabilities);
    
    setDeficiencies(identifiedDeficiencies);
    setProbabilities(calculatedProbabilities);
    setSchedule(recommendationSchedule);
    setProbabilityChartData(chartData);
    setShowResults(true);
  };

  return (
    <CalculatorCard
      icon={Leaf}
      title="Identificador de Deficiências"
      description="Identifique possíveis deficiências nutricionais com base nos sintomas observados"
    >
      <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
        {/* Parâmetros */}
        <DeficiencyParameters
          selectedSymptoms={selectedSymptoms}
          handleSymptomChange={handleSymptomChange}
          phValue={phValue}
          setPHValue={setPHValue}
          ecValue={ecValue}
          setECValue={setECValue}
          growthStage={growthStage}
          setGrowthStage={setGrowthStage}
          handleIdentifyDeficiencies={handleIdentifyDeficiencies}
        />

        {/* Resultados */}
        <DeficiencyResults
          deficiencies={deficiencies}
          probabilities={probabilities}
          schedule={schedule}
          showResults={showResults}
        />

        {/* Gráfico */}
        <div className="md:col-span-2">
          {probabilityChartData && (
            <DeficiencyChart
              probabilityChartData={probabilityChartData}
              showResults={showResults}
            />
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};

export default DeficiencyCalculator;

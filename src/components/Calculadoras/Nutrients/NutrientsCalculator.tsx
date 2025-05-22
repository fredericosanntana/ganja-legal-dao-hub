import React from "react";
import { useState, useEffect, useRef } from "react";
import { Leaf } from "lucide-react";
import CalculatorCard from "../common/CalculatorCard";
import NutrientsParameters from "./NutrientsParameters";
import NutrientsResults from "./NutrientsResults";
import NutrientsChart from "./NutrientsChart";
import {
  NUTRIENT_DOSAGES,
  calculateNutrients,
  checkIncompatibilities,
  generateFeedingSchedule,
  generateNutrientLevelsData
} from "./nutrientsUtils";

const NutrientsCalculator: React.FC = () => {
  const [growthPhase, setGrowthPhase] = useState<string>("vegetativo");
  const [substrate, setSubstrate] = useState<string>("solo");
  const [waterVolume, setWaterVolume] = useState<number>(20);
  const [waterEC, setWaterEC] = useState<number>(0.2);
  const [waterHardness, setWaterHardness] = useState<string>("medium");
  const [selectedNutrients, setSelectedNutrients] = useState<Record<string, boolean>>({
    "Grow (Vegetativo)": true,
    "Bloom (Floração)": true,
    "Micro": true,
    "CalMag": false,
    "Silício": false,
    "Enzimas": false,
    "PK Booster": false,
    "Estimulador de Raízes": false,
    "Potenciador de Floração": false
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  
  const [targetEC, setTargetEC] = useState<number>(0);
  const [resultEC, setResultEC] = useState<number>(0);
  const [dosages, setDosages] = useState<Record<string, { mlPerLiter: number; mlTotal: number }>>({});
  const [incompatibilities, setIncompatibilities] = useState<string[]>([]);
  const [schedule, setSchedule] = useState<Record<string, number>>({});
  const [nutrientLevelsData, setNutrientLevelsData] = useState<any>(null);

  const handleNutrientChange = (nutrient: string, checked: boolean) => {
    setSelectedNutrients(prev => ({
      ...prev,
      [nutrient]: checked
    }));
  };

  const handleCalculate = () => {
    const result = calculateNutrients(
      growthPhase,
      substrate,
      waterVolume,
      waterEC,
      waterHardness,
      selectedNutrients
    );
    
    const incompatibilitiesList = checkIncompatibilities(selectedNutrients);
    const feedingSchedule = generateFeedingSchedule(growthPhase, result.dosages);
    const chartData = generateNutrientLevelsData(result.dosages, growthPhase);
    
    setTargetEC(result.targetEC);
    setResultEC(result.resultEC);
    setDosages(result.dosages);
    setIncompatibilities(incompatibilitiesList);
    setSchedule(feedingSchedule);
    setNutrientLevelsData(chartData);
    setShowResults(true);
  };

  return (
    <CalculatorCard
      icon={Leaf}
      title="Calculadora de Nutrientes"
      description="Calcule as dosagens de nutrientes para cada fase do cultivo"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parâmetros */}
        <div className="space-y-4 md:col-span-2">
          <NutrientsParameters
            growthPhase={growthPhase}
            setGrowthPhase={setGrowthPhase}
            substrate={substrate}
            setSubstrate={setSubstrate}
            waterVolume={waterVolume}
            setWaterVolume={setWaterVolume}
            waterEC={waterEC}
            setWaterEC={setWaterEC}
            waterHardness={waterHardness}
            setWaterHardness={setWaterHardness}
            selectedNutrients={selectedNutrients}
            handleNutrientChange={handleNutrientChange}
            handleCalculate={handleCalculate}
          />
        </div>

        {/* Resultados */}
        <div className="space-y-4 md:col-span-2">
          <NutrientsResults
            showResults={showResults}
            targetEC={targetEC}
            resultEC={resultEC}
            dosages={dosages}
            incompatibilities={incompatibilities}
            schedule={schedule}
          />
        </div>

        {/* Gráficos */}
        <div className="space-y-4 md:col-span-2">
          {nutrientLevelsData && (
            <NutrientsChart
              nutrientLevelsData={nutrientLevelsData}
              showResults={showResults}
            />
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};

export default NutrientsCalculator;

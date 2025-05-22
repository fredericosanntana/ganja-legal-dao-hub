import React from "react";
import { useState, useEffect } from "react";
import { Droplet, Leaf } from "lucide-react";
import CalculatorCard from "../common/CalculatorCard";
import ECFlushParameters from "./ECFlushParameters";
import ECFlushResults from "./ECFlushResults";
import ECFlushChart from "./ECFlushChart";
import {
  TARGET_FLUSH_EC,
  convertToEC,
  calculateWaterVolume,
  calculateNumberOfFlushes,
  generateECReductionSchedule,
  generateFlushRecommendations,
  generateSubstrateInstructions,
  generateECReductionChartData,
  generateFlushEfficiencyChartData
} from "./ecFlushUtils";

const ECFlushCalculator: React.FC = () => {
  const [currentEC, setCurrentEC] = useState<number>(2.0);
  const [ecUnit, setEcUnit] = useState<string>("ec");
  const [waterEC, setWaterEC] = useState<number>(0.2);
  const [potSize, setPotSize] = useState<number>(10);
  const [substrate, setSubstrate] = useState<string>("coco");
  const [daysRemaining, setDaysRemaining] = useState<number>(14);

  const [waterVolume, setWaterVolume] = useState<number>(0);
  const [flushCount, setFlushCount] = useState<number>(0);
  const [schedule, setSchedule] = useState<Array<{ day: number; ec: string; action: string }>>([]);
  const [recommendations, setRecommendations] = useState<{ status: string; actions: string[] }>({ status: "", actions: [] });
  const [substrateInstructions, setSubstrateInstructions] = useState<string[]>([]);
  const [ecReductionData, setEcReductionData] = useState<any>(null);
  const [flushEfficiencyData, setFlushEfficiencyData] = useState<any>(null);

  useEffect(() => {
    // Converter EC se necessário
    const standardizedEC = convertToEC(currentEC, ecUnit);
    
    // Calcular valores
    const volume = calculateWaterVolume(potSize, substrate);
    const flushes = calculateNumberOfFlushes(standardizedEC, TARGET_FLUSH_EC, substrate);
    const scheduleData = generateECReductionSchedule(standardizedEC, TARGET_FLUSH_EC, daysRemaining, flushes);
    const recommendationsData = generateFlushRecommendations(standardizedEC, waterEC, daysRemaining, flushes);
    const instructions = generateSubstrateInstructions(substrate, volume, flushes);
    
    // Atualizar estados
    setWaterVolume(volume);
    setFlushCount(flushes);
    setSchedule(scheduleData);
    setRecommendations(recommendationsData);
    setSubstrateInstructions(instructions);
    setEcReductionData(generateECReductionChartData(scheduleData));
    setFlushEfficiencyData(generateFlushEfficiencyChartData(substrate, standardizedEC, TARGET_FLUSH_EC));
    
  }, [currentEC, ecUnit, waterEC, potSize, substrate, daysRemaining]);

  return (
    <CalculatorCard
      icon={Droplet}
      title="Calculadora de Flush EC"
      description="Planeje o flush pré-colheita para reduzir a EC do substrato"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parâmetros */}
        <ECFlushParameters
          currentEC={currentEC}
          setCurrentEC={setCurrentEC}
          ecUnit={ecUnit}
          setEcUnit={setEcUnit}
          waterEC={waterEC}
          setWaterEC={setWaterEC}
          potSize={potSize}
          setPotSize={setPotSize}
          substrate={substrate}
          setSubstrate={setSubstrate}
          daysRemaining={daysRemaining}
          setDaysRemaining={setDaysRemaining}
        />

        {/* Resultados */}
        <ECFlushResults
          waterVolume={waterVolume}
          flushCount={flushCount}
          schedule={schedule}
          recommendations={recommendations}
          substrateInstructions={substrateInstructions}
        />

        {/* Gráficos */}
        <div className="md:col-span-2">
          {ecReductionData && flushEfficiencyData && (
            <ECFlushChart
              ecReductionData={ecReductionData}
              flushEfficiencyData={flushEfficiencyData}
            />
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};

export default ECFlushCalculator;

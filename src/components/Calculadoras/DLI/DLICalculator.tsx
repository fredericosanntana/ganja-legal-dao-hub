import React from "react";
import { useState, useEffect, useRef } from "react";
import { Lightbulb } from "lucide-react";
import CalculatorCard from "../common/CalculatorCard";
import DLIParameters from "./DLIParameters";
import DLIResults from "./DLIResults";
import DLIChart from "./DLIChart";
import {
  luxToPPFD,
  adjustPPFDForDistance,
  calculateDLI,
  getDLIZone,
  generateDLIRecommendations,
  estimateEnergyConsumption,
  generateLightCurveData,
  generateDLIComparisonData
} from "./dliUtils";

const DLICalculator: React.FC = () => {
  const [lightType, setLightType] = useState<string>("hps");
  const [lightIntensity, setLightIntensity] = useState<number>(10000);
  const [lightHours, setLightHours] = useState<number>(18);
  const [lightDistance, setLightDistance] = useState<number>(50);
  const [growthStage, setGrowthStage] = useState<string>("vegetativo");
  const [growArea, setGrowArea] = useState<number>(1);

  const [ppfdValue, setPpfdValue] = useState<number>(0);
  const [dliValue, setDliValue] = useState<number>(0);
  const [dliZone, setDliZone] = useState<string>("optimal");
  const [recommendations, setRecommendations] = useState<{status: string, actions: string[]}>({status: "", actions: []});
  const [energyValue, setEnergyValue] = useState<number>(0);
  const [lightCurveData, setLightCurveData] = useState<any>(null);
  const [dliComparisonData, setDliComparisonData] = useState<any>(null);

  useEffect(() => {
    // Calcular valores
    let ppfd = luxToPPFD(lightIntensity, lightType);
    if (lightType !== 'sol') {
      ppfd = adjustPPFDForDistance(ppfd, 50, lightDistance);
    }
    const dli = calculateDLI(ppfd, lightHours);
    const zone = getDLIZone(dli, growthStage);
    const recommendations = generateDLIRecommendations(dli, zone, ppfd, lightHours, growthStage);
    const energyConsumption = estimateEnergyConsumption(ppfd, growArea, lightType, lightHours);

    // Atualizar estados
    setPpfdValue(ppfd);
    setDliValue(dli);
    setDliZone(zone);
    setRecommendations(recommendations);
    setEnergyValue(energyConsumption);
    setLightCurveData(generateLightCurveData(ppfd, lightHours));
    setDliComparisonData(generateDLIComparisonData(dli));

  }, [lightType, lightIntensity, lightHours, lightDistance, growthStage, growArea]);

  return (
    <CalculatorCard
      icon={Lightbulb}
      title="Calculadora DLI (Daily Light Integral)"
      description="Calcule a quantidade total de luz fotossinteticamente ativa recebida pelas plantas"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parâmetros */}
        <DLIParameters
          lightType={lightType}
          setLightType={setLightType}
          lightIntensity={lightIntensity}
          setLightIntensity={setLightIntensity}
          lightHours={lightHours}
          setLightHours={setLightHours}
          lightDistance={lightDistance}
          setLightDistance={setLightDistance}
          growthStage={growthStage}
          setGrowthStage={setGrowthStage}
          growArea={growArea}
          setGrowArea={setGrowArea}
          ppfdValue={ppfdValue}
        />

        {/* Resultados */}
        <DLIResults
          dliValue={dliValue}
          dliZone={dliZone}
          recommendations={recommendations}
          energyValue={energyValue}
        />

        {/* Gráficos */}
        <div className="md:col-span-2">
          {lightCurveData && dliComparisonData && (
            <DLIChart
              lightCurveData={lightCurveData}
              dliComparisonData={dliComparisonData}
            />
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};

export default DLICalculator;

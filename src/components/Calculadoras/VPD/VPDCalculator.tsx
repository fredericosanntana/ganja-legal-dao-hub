import React from "react";
import { useState, useEffect } from "react";
import { Thermometer } from "lucide-react";
import CalculatorCard from "../common/CalculatorCard";
import VPDParameters from "./VPDParameters";
import VPDResults from "./VPDResults";
import VPDChart from "./VPDChart";
import VPDInfo from "./VPDInfo";
import {
  calculateVPD,
  estimateLeafTemperature,
  getVPDZone,
  generateVPDRecommendations,
  generateChartData,
} from "./vpdUtils";

const VPDCalculator: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(25);
  const [humidity, setHumidity] = useState<number>(60);
  const [leafTemperature, setLeafTemperature] = useState<string>("");
  const [growthStage, setGrowthStage] = useState<string>("vegetativo");
  const [vpdResult, setVpdResult] = useState<number | null>(null);
  const [vpdZone, setVpdZone] = useState<string>("optimal");
  const [recommendations, setRecommendations] = useState<{
    status: string;
    actions: string[];
  }>({ status: "", actions: [] });
  const [chartData, setChartData] = useState(generateChartData(growthStage));

  useEffect(() => {
    const leafTemp =
      leafTemperature === ""
        ? estimateLeafTemperature(temperature)
        : parseFloat(leafTemperature);
    const vpd = calculateVPD(leafTemp, temperature, humidity);
    const zone = getVPDZone(vpd, growthStage);
    const recs = generateVPDRecommendations(
      vpd,
      zone,
      temperature,
      humidity,
      growthStage
    );

    setVpdResult(vpd);
    setVpdZone(zone);
    setRecommendations(recs);
    setChartData(generateChartData(growthStage));
  }, [temperature, humidity, leafTemperature, growthStage]);

  const handleResetLeafTemp = () => {
    setLeafTemperature("");
  };

  return (
    <CalculatorCard
      icon={Thermometer}
      title="Calculadora VPD (Vapor Pressure Deficit)"
      description="Calcule o Déficit de Pressão de Vapor para otimizar condições de cultivo"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parâmetros */}
        <VPDParameters
          temperature={temperature}
          setTemperature={setTemperature}
          humidity={humidity}
          setHumidity={setHumidity}
          leafTemperature={leafTemperature}
          setLeafTemperature={setLeafTemperature}
          growthStage={growthStage}
          setGrowthStage={setGrowthStage}
          handleResetLeafTemp={handleResetLeafTemp}
        />

        {/* Resultados */}
        <VPDResults
          vpdResult={vpdResult}
          vpdZone={vpdZone}
          recommendations={recommendations}
        />

        {/* Gráfico */}
        <div className="space-y-4 md:col-span-2">
          <VPDChart chartData={chartData} />
        </div>
      </div>

      {/* Sobre VPD */}
      <VPDInfo />
    </CalculatorCard>
  );
};

export default VPDCalculator;

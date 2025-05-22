import React from "react";
import { useState, useEffect, useRef } from "react";
import { Droplets } from "lucide-react";
import CalculatorCard from "../common/CalculatorCard";
import DewPointParameters from "./DewPointParameters";
import DewPointResults from "./DewPointResults";
import DewPointChart from "./DewPointChart";
import {
  calculateDewPoint,
  calculateMoldRisk,
  estimateDryingRate,
  generateDewPointRecommendations,
  generateSchedule,
} from "./dewPointUtils";
import { Chart } from "chart.js/auto";

const DewPointCalculator: React.FC = () => {
  const [temperature, setTemperature] = useState<number>(18);
  const [humidity, setHumidity] = useState<number>(60);
  const [phase, setPhase] = useState<string>("secagemInicial");
  const [density, setDensity] = useState<string>("medio");
  const [airflow, setAirflow] = useState<string>("media");
  
  const [dewPoint, setDewPoint] = useState<number>(0);
  const [moldRisk, setMoldRisk] = useState<string>("baixo");
  const [dryingRate, setDryingRate] = useState<{dailyRate: number, estimatedDays: number}>({dailyRate: 0, estimatedDays: 0});
  const [recommendations, setRecommendations] = useState<{status: string, actions: string[]}>({status: "", actions: []});
  const [schedule, setSchedule] = useState(generateSchedule(density));
  const [moldChartData, setMoldChartData] = useState<any>(null);
  const [scheduleChartData, setScheduleChartData] = useState<any>(null);

  useEffect(() => {
    const dp = calculateDewPoint(temperature, humidity);
    const risk = calculateMoldRisk(temperature, dp);
    const dryingRateInfo = estimateDryingRate(temperature, humidity, density, airflow);
    const recommendationsInfo = generateDewPointRecommendations(
      temperature, humidity, dp, risk, dryingRateInfo, phase, density, airflow
    );
    const scheduleInfo = generateSchedule(density);

    setDewPoint(dp);
    setMoldRisk(risk);
    setDryingRate(dryingRateInfo);
    setRecommendations(recommendationsInfo);
    setSchedule(scheduleInfo);

    // Criar dados para o gráfico de mofo
    const labels = Array.from({ length: 5 }, (_, i) => temperature - 2 + i);
    const moldChartData = {
      labels,
      datasets: [{
        label: 'Ponto de Orvalho',
        data: labels.map(t => calculateDewPoint(t, humidity)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };
    setMoldChartData(moldChartData);

    // Criar dados para o gráfico de cronograma
    const scheduleChartData = {
      labels: ['Secagem Inicial', 'Secagem Média', 'Cura'],
      datasets: [{
        label: 'Dias',
        data: [
          scheduleInfo.secagemInicial.dias,
          scheduleInfo.secagemMedia.dias,
          scheduleInfo.cura.dias
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)'
        ]
      }]
    };
    setScheduleChartData(scheduleChartData);

  }, [temperature, humidity, phase, density, airflow]);

  return (
    <CalculatorCard
      icon={Droplets}
      title="Calculadora de Ponto de Orvalho"
      description="Secagem e Cura de Cannabis"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Parâmetros */}
        <DewPointParameters
          temperature={temperature}
          setTemperature={setTemperature}
          humidity={humidity}
          setHumidity={setHumidity}
          phase={phase}
          setPhase={setPhase}
          density={density}
          setDensity={setDensity}
          airflow={airflow}
          setAirflow={setAirflow}
        />

        {/* Resultados */}
        <DewPointResults
          dewPoint={dewPoint}
          moldRisk={moldRisk}
          dryingRate={dryingRate}
          recommendations={recommendations}
        />

        {/* Gráficos e Cronograma */}
        <div className="md:col-span-2">
          {moldChartData && scheduleChartData && (
            <DewPointChart
              moldChartData={moldChartData}
              scheduleChartData={scheduleChartData}
              schedule={schedule}
            />
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};

export default DewPointCalculator;

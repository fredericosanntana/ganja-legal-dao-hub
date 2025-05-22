import React from "react";
import ChartComponent from "../common/ChartComponent";
import { ChartData, ChartOptions } from "chart.js/auto";

interface DLIChartProps {
  lightCurveData: ChartData;
  dliComparisonData: ChartData;
}

const DLIChart: React.FC<DLIChartProps> = ({
  lightCurveData,
  dliComparisonData,
}) => {
  const lightCurveOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Hora do Dia",
        },
      },
      y: {
        title: {
          display: true,
          text: "PPFD (μmol/m²/s)",
        },
        min: 0,
      },
    },
  };

  const dliComparisonOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Estágio de Crescimento",
        },
      },
      y: {
        title: {
          display: true,
          text: "DLI (mol/m²/dia)",
        },
        min: 0,
        max: 60,
      },
    },
  };

  return (
    <div className="space-y-4">
      <ChartComponent
        type="bar"
        data={lightCurveData}
        options={lightCurveOptions}
        height={250}
      />
      
      <ChartComponent
        type="bar"
        data={dliComparisonData}
        options={dliComparisonOptions}
        height={250}
      />
    </div>
  );
};

export default DLIChart;

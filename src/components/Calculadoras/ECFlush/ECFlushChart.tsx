import React from "react";
import ChartComponent from "../common/ChartComponent";
import { ChartData, ChartOptions } from "chart.js/auto";

interface ECFlushChartProps {
  ecReductionData: ChartData;
  flushEfficiencyData: ChartData;
}

const ECFlushChart: React.FC<ECFlushChartProps> = ({
  ecReductionData,
  flushEfficiencyData,
}) => {
  const ecReductionOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Cronograma",
        },
      },
      y: {
        title: {
          display: true,
          text: "EC",
        },
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const flushEfficiencyOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Número de Flushes",
        },
      },
      y: {
        title: {
          display: true,
          text: "EC",
        },
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  return (
    <div className="space-y-4">
      <ChartComponent
        type="line"
        data={ecReductionData}
        options={ecReductionOptions}
        height={250}
      />
      
      <ChartComponent
        type="line"
        data={flushEfficiencyData}
        options={flushEfficiencyOptions}
        height={250}
      />
    </div>
  );
};

export default ECFlushChart;

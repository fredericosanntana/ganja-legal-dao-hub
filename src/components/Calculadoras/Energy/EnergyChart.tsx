import React from "react";
import ChartComponent from "../common/ChartComponent";
import { ChartData, ChartOptions } from "chart.js/auto";

interface EnergyChartProps {
  showResults: boolean;
  chartData: ChartData | null;
}

const EnergyChart: React.FC<EnergyChartProps> = ({
  showResults,
  chartData,
}) => {
  if (!showResults || !chartData) {
    return null;
  }

  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Consumo (kWh) / Custo (R$)'
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)}`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Consumo por Equipamento</h3>
      <div className="h-80">
        <ChartComponent
          type="bar"
          data={chartData}
          options={chartOptions}
          height={320}
        />
      </div>
    </div>
  );
};

export default EnergyChart;

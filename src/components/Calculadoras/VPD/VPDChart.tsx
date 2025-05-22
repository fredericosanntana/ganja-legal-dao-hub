import React from "react";
import ChartComponent from "../common/ChartComponent";
import { ChartData, ChartOptions } from "chart.js/auto";

interface VPDChartProps {
  chartData: ChartData;
}

const VPDChart: React.FC<VPDChartProps> = ({ chartData }) => {
  const chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: "Temperatura (°C)",
        },
      },
      y: {
        title: {
          display: true,
          text: "VPD (kPa)",
        },
        min: 0,
        max: 3,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => `Temperatura: ${tooltipItems[0].label}`,
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      <ChartComponent type="line" data={chartData} options={chartOptions} height={250} />
      <p className="text-sm text-muted-foreground">
        O gráfico mostra o VPD para diferentes combinações de temperatura e umidade.
        A área entre as linhas tracejadas verdes representa a faixa ideal para o estágio selecionado.
      </p>
    </div>
  );
};

export default VPDChart;

import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface CECChartProps {
  showResults: boolean;
  chartData: any;
}

const CECChart: React.FC<CECChartProps> = ({ showResults, chartData }) => {
  if (!showResults || !chartData) {
    return null;
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#FFFFFF",
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: function(context) {
            if (context.parsed.y !== null) {
              return `${context.dataset.label}: ${context.parsed.y}g`;
            }
            return null;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: "#FFFFFF",
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 10
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        }
      },
      y: {
        ticks: {
          color: "#FFFFFF"
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)"
        },
        title: {
          display: true,
          text: "Rendimento (g)",
          color: "#FFFFFF"
        }
      }
    }
  };

  return (
    <div className="bg-muted/20 p-4 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Projeção de Colheita ao Longo do Tempo</h3>
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
      <p className="text-sm text-muted-foreground mt-2">
        Este gráfico mostra a projeção de desenvolvimento das plantas ao longo do ciclo de cultivo.
      </p>
    </div>
  );
};

export default CECChart;

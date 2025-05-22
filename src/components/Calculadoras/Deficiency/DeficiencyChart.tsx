import React from "react";
import ChartComponent from "../common/ChartComponent";
import { ChartData, ChartOptions } from "chart.js/auto";

interface DeficiencyChartProps {
  probabilityChartData: ChartData;
  showResults: boolean;
}

const DeficiencyChart: React.FC<DeficiencyChartProps> = ({
  probabilityChartData,
  showResults,
}) => {
  if (!showResults) {
    return null;
  }

  const probabilityChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          callback: function(value) {
            return (Number(value) * 100) + '%';
          }
        },
        title: {
          display: true,
          text: 'Probabilidade'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Nutrientes'
        }
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Probabilidade: ${(context.parsed.y * 100).toFixed(0)}%`;
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      <h6 className="text-lg font-medium">Probabilidade de Deficiências:</h6>
      <ChartComponent
        type="bar"
        data={probabilityChartData}
        options={probabilityChartOptions}
        height={250}
      />
      <p className="text-sm text-muted-foreground">
        O gráfico mostra a probabilidade estimada de cada deficiência com base nos sintomas e parâmetros informados.
        Valores acima de 70% indicam alta probabilidade de deficiência.
      </p>
    </div>
  );
};

export default DeficiencyChart;

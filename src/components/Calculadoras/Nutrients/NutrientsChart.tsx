import React from "react";
import ChartComponent from "../common/ChartComponent";
import { ChartData, ChartOptions } from "chart.js/auto";

interface NutrientsChartProps {
  nutrientLevelsData: ChartData;
  showResults: boolean;
}

const NutrientsChart: React.FC<NutrientsChartProps> = ({
  nutrientLevelsData,
  showResults,
}) => {
  if (!showResults) {
    return null;
  }

  const nutrientLevelsOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    }
  };

  return (
    <div className="space-y-4">
      <h6 className="text-lg font-medium">Níveis de Nutrientes:</h6>
      <ChartComponent
        type="radar"
        data={nutrientLevelsData}
        options={nutrientLevelsOptions}
        height={250}
      />
      <div className="mt-4">
        <h6 className="font-medium">Medição e Monitoramento</h6>
        <p>
          A condutividade elétrica (EC) é uma medida da concentração total de sais
          dissolvidos na solução nutritiva. Diferentes fases de crescimento e substratos
          requerem diferentes níveis de EC:
        </p>
        <ul className="list-disc pl-5 space-y-1 mt-2">
          <li><strong>Mudas/Clones:</strong> EC baixa (0.4-1.2 mS/cm)</li>
          <li><strong>Vegetativo:</strong> EC média (0.8-2.2 mS/cm)</li>
          <li><strong>Floração:</strong> EC mais alta (1.2-2.6 mS/cm)</li>
          <li><strong>Flush:</strong> EC muito baixa (0-0.4 mS/cm)</li>
        </ul>
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Nota: Esta calculadora fornece recomendações gerais. Ajuste as dosagens com base
        na resposta específica das suas plantas e nas recomendações do fabricante dos
        nutrientes.
      </p>
    </div>
  );
};

export default NutrientsChart;

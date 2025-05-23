import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ArcElement,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export interface NutrientsChartProps {
  params?: {
    growthStage: string;
    cultivarType: string;
    waterVolume: number;
    desiredEC: number;
    addMicronutrients: boolean;
  };
  nutrientLevelsData?: any; // Added for compatibility with NutrientsCalculator
  showResults?: boolean; // Added for compatibility with NutrientsCalculator
}

export const NutrientsChart: React.FC<NutrientsChartProps> = ({ params, nutrientLevelsData, showResults }) => {
  // If nutrientLevelsData is provided, use that instead of calculating from params
  if (nutrientLevelsData && showResults) {
    return (
      <div className="chart-container">
        <Bar data={nutrientLevelsData} options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Níveis de Nutrientes',
            },
          },
        }} />
      </div>
    );
  }
  
  // Otherwise, fall back to original functionality with params
  if (!params) return null;
  
  // Valores simulados para NPK baseados no estágio de crescimento
  let nitrogen = 0;
  let phosphorus = 0;
  let potassium = 0;
  
  switch (params.growthStage) {
    case 'seedling':
      nitrogen = 2.0;
      phosphorus = 1.0;
      potassium = 1.0;
      break;
    case 'vegetative':
      nitrogen = 3.0;
      phosphorus = 1.5;
      potassium = 2.0;
      break;
    case 'flowering':
      nitrogen = 1.5;
      phosphorus = 3.0;
      potassium = 3.0;
      break;
    case 'late_flowering':
      nitrogen = 0.5;
      phosphorus = 2.0;
      potassium = 3.5;
      break;
    default:
      nitrogen = 2.0;
      phosphorus = 2.0;
      potassium = 2.0;
  }
  
  const chartData: ChartData<'bar'> = {
    labels: ['N', 'P', 'K'],
    datasets: [
      {
        label: 'Proporção de Nutrientes',
        data: [nitrogen, phosphorus, potassium],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      }
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Proporção NPK para cada fase',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default NutrientsChart;

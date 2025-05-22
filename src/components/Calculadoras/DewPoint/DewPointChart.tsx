import React from "react";
import ChartComponent from "../common/ChartComponent";
import { ChartData, ChartOptions } from "chart.js/auto";

interface DewPointChartProps {
  moldChartData: ChartData;
  scheduleChartData: ChartData;
  schedule: {
    secagemInicial: { dias: number; temperatura: string; umidade: string };
    secagemMedia: { dias: number; temperatura: string; umidade: string };
    cura: { dias: number; temperatura: string; umidade: string };
  };
}

const DewPointChart: React.FC<DewPointChartProps> = ({
  moldChartData,
  scheduleChartData,
  schedule,
}) => {
  const moldChartOptions: ChartOptions = {
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
          text: "Ponto de Orvalho (°C)",
        },
        min: 0,
        max: 30,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: (tooltipItems) => `Temperatura: ${tooltipItems[0].label}°C`,
        },
      },
      legend: {
        display: true,
        position: "bottom",
      },
    },
  };

  const scheduleChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Dias",
        },
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
        data={moldChartData}
        options={moldChartOptions}
        height={250}
      />
      
      <ChartComponent
        type="bar"
        data={scheduleChartData}
        options={scheduleChartOptions}
        height={250}
      />
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Fase</th>
              <th className="p-2 text-left">Dias</th>
              <th className="p-2 text-left">Temp.</th>
              <th className="p-2 text-left">Umid.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Secagem Inicial</td>
              <td>{schedule.secagemInicial.dias}</td>
              <td>{schedule.secagemInicial.temperatura}</td>
              <td>{schedule.secagemInicial.umidade}</td>
            </tr>
            <tr>
              <td>Secagem Média</td>
              <td>{schedule.secagemMedia.dias}</td>
              <td>{schedule.secagemMedia.temperatura}</td>
              <td>{schedule.secagemMedia.umidade}</td>
            </tr>
            <tr>
              <td>Cura</td>
              <td>{schedule.cura.dias}</td>
              <td>{schedule.cura.temperatura}</td>
              <td>{schedule.cura.umidade}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DewPointChart;

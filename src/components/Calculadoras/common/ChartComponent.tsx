
import React from "react";
import { Chart, ChartData, ChartOptions } from "chart.js/auto";
import { useEffect, useRef } from "react";

interface ChartComponentProps {
  type: "line" | "bar" | "radar";
  data: ChartData;
  options?: ChartOptions;
  height?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({
  type,
  data,
  options,
  height = 250,
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    // Destruir gráfico existente
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Criar novo gráfico
    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type,
        data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options,
        },
      });
    }

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options]);

  return (
    <div style={{ height: `${height}px` }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;

import React from "react";
import { Label } from "@/components/ui/label";
import RangeInput from "../common/RangeInput";

interface DewPointParametersProps {
  temperature: number;
  setTemperature: (value: number) => void;
  humidity: number;
  setHumidity: (value: number) => void;
  phase: string;
  setPhase: (value: string) => void;
  density: string;
  setDensity: (value: string) => void;
  airflow: string;
  setAirflow: (value: string) => void;
}

const DewPointParameters: React.FC<DewPointParametersProps> = ({
  temperature,
  setTemperature,
  humidity,
  setHumidity,
  phase,
  setPhase,
  density,
  setDensity,
  airflow,
  setAirflow,
}) => {
  return (
    <div className="space-y-4">
      <RangeInput
        id="temperature"
        label="Temperatura Ambiente (°C)"
        min={10}
        max={30}
        step={0.5}
        value={temperature}
        onChange={setTemperature}
        unit="°C"
      />

      <RangeInput
        id="humidity"
        label="Umidade Relativa (%)"
        min={30}
        max={80}
        step={1}
        value={humidity}
        onChange={setHumidity}
        unit="%"
      />

      <div className="space-y-2">
        <Label htmlFor="drying-phase">Fase</Label>
        <select
          id="drying-phase"
          value={phase}
          onChange={(e) => setPhase(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="secagemInicial">Secagem Inicial</option>
          <option value="secagemMedia">Secagem Média</option>
          <option value="cura">Cura</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="material-density">Densidade do Material</Label>
        <select
          id="material-density"
          value={density}
          onChange={(e) => setDensity(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="solto">Solto (flores pequenas)</option>
          <option value="medio">Médio (flores médias)</option>
          <option value="denso">Denso (flores grandes)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="airflow">Circulação de Ar</Label>
        <select
          id="airflow"
          value={airflow}
          onChange={(e) => setAirflow(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="baixa">Baixa (ambiente fechado)</option>
          <option value="media">Média (ventilação suave)</option>
          <option value="alta">Alta (ventilador direto)</option>
        </select>
      </div>
    </div>
  );
};

export default DewPointParameters;

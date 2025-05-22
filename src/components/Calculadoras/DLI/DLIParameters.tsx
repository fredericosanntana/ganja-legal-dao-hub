import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import RangeInput from "../common/RangeInput";

interface DLIParametersProps {
  lightType: string;
  setLightType: (value: string) => void;
  lightIntensity: number;
  setLightIntensity: (value: number) => void;
  lightHours: number;
  setLightHours: (value: number) => void;
  lightDistance: number;
  setLightDistance: (value: number) => void;
  growthStage: string;
  setGrowthStage: (value: string) => void;
  growArea: number;
  setGrowArea: (value: number) => void;
  ppfdValue: number;
}

const DLIParameters: React.FC<DLIParametersProps> = ({
  lightType,
  setLightType,
  lightIntensity,
  setLightIntensity,
  lightHours,
  setLightHours,
  lightDistance,
  setLightDistance,
  growthStage,
  setGrowthStage,
  growArea,
  setGrowArea,
  ppfdValue,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Tipo de Luz</Label>
        <RadioGroup
          value={lightType}
          onValueChange={setLightType}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hps" id="light-hps" />
            <Label htmlFor="light-hps">HPS</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="led" id="light-led" />
            <Label htmlFor="light-led">LED</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="cmh" id="light-cmh" />
            <Label htmlFor="light-cmh">CMH</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fluorescente" id="light-fluorescente" />
            <Label htmlFor="light-fluorescente">Fluo</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="sol" id="light-sol" />
            <Label htmlFor="light-sol">Sol</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="light-intensity">Intensidade da Luz (lux)</Label>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            id="light-intensity"
            min={100}
            max={100000}
            step={100}
            value={lightIntensity}
            onChange={(e) => setLightIntensity(parseFloat(e.target.value))}
          />
          <span className="text-sm text-muted-foreground">lux</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Equivalente a <span>{Math.round(ppfdValue)}</span> μmol/m²/s (PPFD)
        </p>
      </div>

      <RangeInput
        id="light-hours"
        label="Horas de Luz por Dia"
        min={6}
        max={24}
        step={0.5}
        value={lightHours}
        onChange={setLightHours}
        unit="h"
      />

      {lightType !== "sol" && (
        <RangeInput
          id="light-distance"
          label="Distância da Luz às Plantas (cm)"
          min={10}
          max={150}
          step={1}
          value={lightDistance}
          onChange={setLightDistance}
          unit="cm"
        />
      )}

      <div className="space-y-2">
        <Label htmlFor="growth-stage">Estágio de Crescimento</Label>
        <select
          id="growth-stage"
          value={growthStage}
          onChange={(e) => setGrowthStage(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="mudas">Mudas/Clones</option>
          <option value="vegetativo">Vegetativo</option>
          <option value="floracao">Floração</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="grow-area">Área de Cultivo (m²)</Label>
        <Input
          type="number"
          id="grow-area"
          min={0.1}
          max={100}
          step={0.1}
          value={growArea}
          onChange={(e) => setGrowArea(parseFloat(e.target.value))}
        />
        <p className="text-sm text-muted-foreground">
          Opcional, para cálculo de consumo energético
        </p>
      </div>
    </div>
  );
};

export default DLIParameters;

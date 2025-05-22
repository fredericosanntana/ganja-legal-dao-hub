import React from "react";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import RangeInput from "../common/RangeInput";

interface VPDParametersProps {
  temperature: number;
  setTemperature: (value: number) => void;
  humidity: number;
  setHumidity: (value: number) => void;
  leafTemperature: string;
  setLeafTemperature: (value: string) => void;
  growthStage: string;
  setGrowthStage: (value: string) => void;
  handleResetLeafTemp: () => void;
}

const VPDParameters: React.FC<VPDParametersProps> = ({
  temperature,
  setTemperature,
  humidity,
  setHumidity,
  leafTemperature,
  setLeafTemperature,
  growthStage,
  setGrowthStage,
  handleResetLeafTemp,
}) => {
  return (
    <div className="space-y-4">
      <RangeInput
        id="temperature"
        label="Temperatura Ambiente (°C)"
        min={15}
        max={35}
        step={0.5}
        value={temperature}
        onChange={setTemperature}
        unit="°C"
      />

      <RangeInput
        id="humidity"
        label="Umidade Relativa (%)"
        min={20}
        max={90}
        step={1}
        value={humidity}
        onChange={setHumidity}
        unit="%"
      />

      <div className="space-y-2">
        <Label htmlFor="leaf-temperature">Temperatura da Folha (°C)</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            id="leaf-temperature"
            min={10}
            max={35}
            step={0.1}
            value={leafTemperature}
            onChange={(e) => setLeafTemperature(e.target.value)}
            placeholder="Auto"
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleResetLeafTemp}
            className="whitespace-nowrap"
          >
            Auto
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Deixe em branco para estimativa automática
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="growth-stage">Estágio de Crescimento</Label>
        <Select value={growthStage} onValueChange={setGrowthStage}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o estágio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetativo">Vegetativo</SelectItem>
            <SelectItem value="floracaoInicial">Floração Inicial</SelectItem>
            <SelectItem value="floracaoTardia">Floração Tardia</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default VPDParameters;

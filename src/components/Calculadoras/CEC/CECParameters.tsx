
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CECParameters } from "./CECUtils";
import { Slider } from "@/components/ui/slider";

// Define the props interface that matches what's expected in CECCalculator
export interface CECParametersProps {
  parameters: CECParameters;
  updateParameter: (field: keyof CECParameters, value: any) => void;
  handleCalculate: () => void;
}

// Define soil type options
const soilTypes = [
  { value: "sandy", label: "Arenoso" },
  { value: "loamy", label: "Franco (Misto)" },
  { value: "clay", label: "Argiloso" },
  { value: "silt", label: "Siltoso" },
  { value: "peat", label: "Orgânico/Turfa" },
];

// Define preset experience level options
const experienceLevels = [
  { value: "beginner", label: "Iniciante" },
  { value: "intermediate", label: "Intermediário" },
  { value: "advanced", label: "Avançado" },
];

const CECParametersComponent: React.FC<CECParametersProps> = ({
  parameters,
  updateParameter,
  handleCalculate,
}) => {
  // We don't need to create a new parameters object as the type is now properly defined
  return (
    <div className="space-y-4 p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="soilType">Tipo de Solo</Label>
          <Select
            value={parameters.soilType}
            onValueChange={(value) => updateParameter("soilType", value)}
          >
            <SelectTrigger id="soilType">
              <SelectValue placeholder="Selecione o tipo de solo" />
            </SelectTrigger>
            <SelectContent>
              {soilTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="soilPH">pH do Solo: {parameters.soilPH}</Label>
          <Slider
            id="soilPH"
            min={4}
            max={9}
            step={0.1}
            value={[parameters.soilPH]}
            onValueChange={(value) => updateParameter("soilPH", value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>4.0 (Ácido)</span>
            <span>6.5 (Neutro)</span>
            <span>9.0 (Alcalino)</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="organicMatter">
            Matéria Orgânica (%): {parameters.organicMatter}%
          </Label>
          <Slider
            id="organicMatter"
            min={1}
            max={10}
            step={0.5}
            value={[parameters.organicMatter]}
            onValueChange={(value) => updateParameter("organicMatter", value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1%</span>
            <span>5%</span>
            <span>10%</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="clayContent">
            Conteúdo de Argila (%): {parameters.clayContent}%
          </Label>
          <Slider
            id="clayContent"
            min={5}
            max={60}
            step={1}
            value={[parameters.clayContent]}
            onValueChange={(value) => updateParameter("clayContent", value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>5%</span>
            <span>30%</span>
            <span>60%</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experienceLevel">Nível de Experiência</Label>
          <Select
            value={parameters.experienceLevel}
            onValueChange={(value) => updateParameter("experienceLevel", value)}
          >
            <SelectTrigger id="experienceLevel">
              <SelectValue placeholder="Selecione seu nível" />
            </SelectTrigger>
            <SelectContent>
              {experienceLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desiredCEC">
            CEC Desejado (meq/100g): {parameters.desiredCEC}
          </Label>
          <Slider
            id="desiredCEC"
            min={5}
            max={40}
            step={1}
            value={[parameters.desiredCEC]}
            onValueChange={(value) => updateParameter("desiredCEC", value[0])}
            className="py-2"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Baixo (5)</span>
            <span>Médio (20)</span>
            <span>Alto (40)</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleCalculate}
        className="w-full mt-4"
        variant="default"
      >
        Calcular CEC
      </Button>
    </div>
  );
};

export default CECParametersComponent;

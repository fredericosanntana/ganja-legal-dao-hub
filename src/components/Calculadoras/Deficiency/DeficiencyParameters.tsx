import React from "react";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DeficiencyParametersProps {
  selectedSymptoms: string[];
  handleSymptomChange: (symptom: string, checked: boolean) => void;
  phValue: number;
  setPHValue: (value: number) => void;
  ecValue: number;
  setECValue: (value: number) => void;
  growthStage: string;
  setGrowthStage: (value: string) => void;
  handleIdentifyDeficiencies: () => void;
}

const DeficiencyParameters: React.FC<DeficiencyParametersProps> = ({
  selectedSymptoms,
  handleSymptomChange,
  phValue,
  setPHValue,
  ecValue,
  setECValue,
  growthStage,
  setGrowthStage,
  handleIdentifyDeficiencies,
}) => {
  // Lista de todos os sintomas possíveis
  const allSymptoms = [
    "Folhas inferiores amarelando",
    "Crescimento lento",
    "Folhas roxas/vermelhas",
    "Crescimento atrofiado",
    "Bordas amareladas/marrons",
    "Pontos necróticos",
    "Pontos marrons nas folhas",
    "Folhas novas deformadas",
    "Amarelamento entre nervuras",
  ];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Sintomas Observados</Label>
        <div className="space-y-2">
          {allSymptoms.map((symptom) => (
            <div key={symptom} className="flex items-center space-x-2">
              <Checkbox
                id={`symptom-${symptom}`}
                checked={selectedSymptoms.includes(symptom)}
                onCheckedChange={(checked) =>
                  handleSymptomChange(symptom, checked as boolean)
                }
              />
              <Label htmlFor={`symptom-${symptom}`}>{symptom}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ph-value">Valor do pH</Label>
        <Input
          type="number"
          id="ph-value"
          min={4.0}
          max={8.0}
          step={0.1}
          value={phValue}
          onChange={(e) => setPHValue(parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="ec-value">Valor da EC (mS/cm)</Label>
        <Input
          type="number"
          id="ec-value"
          min={0.1}
          max={5.0}
          step={0.1}
          value={ecValue}
          onChange={(e) => setECValue(parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="growth-stage">Estágio de Crescimento</Label>
        <Select value={growthStage} onValueChange={setGrowthStage}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o estágio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vegetativo">Vegetativo</SelectItem>
            <SelectItem value="floracao">Floração</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        className="w-full"
        onClick={handleIdentifyDeficiencies}
      >
        Identificar Deficiências
      </Button>
    </div>
  );
};

export default DeficiencyParameters;

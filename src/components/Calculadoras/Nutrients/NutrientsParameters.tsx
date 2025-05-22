import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NutrientsParametersProps {
  growthPhase: string;
  setGrowthPhase: (value: string) => void;
  substrate: string;
  setSubstrate: (value: string) => void;
  waterVolume: number;
  setWaterVolume: (value: number) => void;
  waterEC: number;
  setWaterEC: (value: number) => void;
  waterHardness: string;
  setWaterHardness: (value: string) => void;
  selectedNutrients: Record<string, boolean>;
  handleNutrientChange: (nutrient: string, checked: boolean) => void;
  handleCalculate: () => void;
}

const NutrientsParameters: React.FC<NutrientsParametersProps> = ({
  growthPhase,
  setGrowthPhase,
  substrate,
  setSubstrate,
  waterVolume,
  setWaterVolume,
  waterEC,
  setWaterEC,
  waterHardness,
  setWaterHardness,
  selectedNutrients,
  handleNutrientChange,
  handleCalculate,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="growth-phase">Fase de Crescimento</Label>
        <Select value={growthPhase} onValueChange={setGrowthPhase}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a fase" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mudas">Mudas/Clones</SelectItem>
            <SelectItem value="vegetativo">Vegetativo</SelectItem>
            <SelectItem value="preFloração">Pré-Floração</SelectItem>
            <SelectItem value="floração">Floração</SelectItem>
            <SelectItem value="flush">Flush</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="substrate-type">Tipo de Substrato</Label>
        <Select value={substrate} onValueChange={setSubstrate}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o substrato" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="solo">Solo</SelectItem>
            <SelectItem value="coco">Coco</SelectItem>
            <SelectItem value="hidroponia">Hidroponia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="water-volume">Volume do Reservatório (L)</Label>
        <Input
          type="number"
          id="water-volume"
          min={1}
          max={1000}
          step={1}
          value={waterVolume}
          onChange={(e) => setWaterVolume(parseFloat(e.target.value))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="water-ec">EC/PPM da Água Base</Label>
        <div className="flex gap-2">
          <Input
            type="number"
            id="water-ec"
            min={0}
            max={3}
            step={0.1}
            value={waterEC}
            onChange={(e) => setWaterEC(parseFloat(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-muted-foreground">mS/cm</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="water-hardness">Dureza da Água</Label>
        <Select value={waterHardness} onValueChange={setWaterHardness}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione a dureza" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="soft">Mole (menos que 100 ppm)</SelectItem>
            <SelectItem value="medium">Média (100-200 ppm)</SelectItem>
            <SelectItem value="hard">Dura (mais que 200 ppm)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Nutrientes Disponíveis</Label>
        <div className="space-y-2">
          {Object.entries(selectedNutrients).map(([nutrient, checked]) => (
            <div key={nutrient} className="flex items-center space-x-2">
              <Checkbox
                id={`nutrient-${nutrient}`}
                checked={checked}
                onCheckedChange={(checked) => handleNutrientChange(nutrient, checked as boolean)}
              />
              <Label htmlFor={`nutrient-${nutrient}`}>{nutrient}</Label>
            </div>
          ))}
        </div>
      </div>

      <Button className="w-full" onClick={handleCalculate}>
        Calcular Nutrientes
      </Button>
    </div>
  );
};

export default NutrientsParameters;

import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import RangeInput from "./common/RangeInput";
import {
  CECParameters as CECParametersType,
  GENETIC_TYPES,
  CULTIVATION_TYPES,
  EXPERIENCE_LEVELS
} from "./CECUtils";

interface CECParametersProps {
  parameters: CECParametersType;
  updateParameter: (field: keyof CECParametersType, value: any) => void;
  handleCalculate: () => void;
}

const CECParameters: React.FC<CECParametersProps> = ({
  parameters,
  updateParameter,
  handleCalculate,
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Informações da Genética</h3>
        
        <div className="space-y-2">
          <Label htmlFor="genetic-type">Tipo de genética</Label>
          <div className="grid grid-cols-3 gap-2">
            {GENETIC_TYPES.map((type) => (
              <Button
                key={type}
                type="button"
                variant={parameters.geneticType === type ? "default" : "outline"}
                className="w-full"
                onClick={() => updateParameter("geneticType", type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cycle-days">Ciclo total estimado (dias)</Label>
          <Input
            id="cycle-days"
            type="number"
            min={30}
            max={180}
            value={parameters.cycleDays}
            onChange={(e) => updateParameter("cycleDays", parseInt(e.target.value))}
          />
          <p className="text-sm text-muted-foreground">
            Total de dias de vegetação + floração
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Configuração do Cultivo</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plant-count">Número de plantas</Label>
            <Input
              id="plant-count"
              type="number"
              min={1}
              max={100}
              value={parameters.plantCount}
              onChange={(e) => updateParameter("plantCount", parseInt(e.target.value))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pot-size">Tamanho dos vasos (L)</Label>
            <Input
              id="pot-size"
              type="number"
              min={1}
              max={100}
              value={parameters.potSize}
              onChange={(e) => updateParameter("potSize", parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cultivation-type">Tipo de cultivo</Label>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {CULTIVATION_TYPES.map((type) => (
              <Button
                key={type}
                type="button"
                variant={parameters.cultivationType === type ? "default" : "outline"}
                className="w-full"
                onClick={() => updateParameter("cultivationType", type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="controlled-environment">Ambiente controlado?</Label>
          <Switch
            id="controlled-environment"
            checked={parameters.controlledEnvironment}
            onCheckedChange={(checked) => updateParameter("controlledEnvironment", checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grower-experience">Experiência do cultivador</Label>
          <div className="grid grid-cols-3 gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <Button
                key={level}
                type="button"
                variant={parameters.growerExperience === level ? "default" : "outline"}
                className="w-full"
                onClick={() => updateParameter("growerExperience", level)}
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-primary">Detalhes Técnicos</h3>
        
        <div className="space-y-2">
          <Label htmlFor="light-coverage">Cobertura de luz (W por planta ou m²)</Label>
          <Input
            id="light-coverage"
            type="number"
            min={10}
            max={1000}
            value={parameters.lightCoverage}
            onChange={(e) => updateParameter("lightCoverage", parseInt(e.target.value))}
          />
          <p className="text-sm text-muted-foreground">
            Potência real em watts por planta ou por metro quadrado
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="nutrition-control">Análise de nutrição</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sem controle</span>
            <Switch
              id="nutrition-control"
              checked={parameters.nutritionControl}
              onCheckedChange={(checked) => updateParameter("nutritionControl", checked)}
            />
            <span className="text-sm text-muted-foreground">Com controle</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="observations">Observações (opcional)</Label>
          <Textarea
            id="observations"
            placeholder="Adicione informações adicionais relevantes sobre seu cultivo..."
            value={parameters.observations}
            onChange={(e) => updateParameter("observations", e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={handleCalculate}
        size="lg"
      >
        Calcular Expectativa de Cultivo
      </Button>
    </div>
  );
};

export default CECParameters;

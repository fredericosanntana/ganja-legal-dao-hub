
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Repeat } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Definindo tipos para os parâmetros
export interface CECParametersType {
  soilType: string;
  soilPH: number;
  organicMatter: number;
  geneticType: string;
  cultivationType: string;
  experienceLevel: string;
  usesAmendments: boolean;
  customNotes: string;
}

// Constantes para opções nos menus
const GENETIC_TYPES = [
  { value: 'indica', label: 'Indica' },
  { value: 'sativa', label: 'Sativa' },
  { value: 'hybrid', label: 'Híbrida' }
];

const CULTIVATION_TYPES = [
  { value: 'soil', label: 'Solo' },
  { value: 'coco', label: 'Coco' },
  { value: 'hydro', label: 'Hidroponia' }
];

const EXPERIENCE_LEVELS = [
  { value: 'beginner', label: 'Iniciante' },
  { value: 'intermediate', label: 'Intermediário' },
  { value: 'advanced', label: 'Avançado' }
];

// Valores padrão para inicialização
export const defaultCECParams: CECParametersType = {
  soilType: 'normal',
  soilPH: 6.5,
  organicMatter: 3,
  geneticType: 'hybrid',
  cultivationType: 'soil',
  experienceLevel: 'intermediate',
  usesAmendments: false,
  customNotes: ''
};

interface CECParametersProps {
  params?: CECParametersType; // For backwards compatibility
  parameters?: CECParametersType; // For CEC Calculator
  onChange?: (updatedParams: Partial<CECParametersType>) => void;
  updateParameter?: (field: keyof CECParametersType, value: any) => void;
  handleCalculate?: () => void;
}

const CECParameters: React.FC<CECParametersProps> = ({
  params,
  parameters,
  onChange,
  updateParameter,
  handleCalculate
}) => {
  // Use either params or parameters based on what's provided
  const paramData = parameters || params || defaultCECParams;
  
  const handleReset = () => {
    if (onChange) {
      onChange(defaultCECParams);
    }
  };

  const handleParamChange = (field: keyof CECParametersType, value: any) => {
    if (updateParameter) {
      updateParameter(field, value);
    } else if (onChange) {
      onChange({ [field]: value });
    }
  };

  const handleCalculateClick = () => {
    if (handleCalculate) {
      handleCalculate();
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">Parâmetros CEC</h2>
          <Button variant="outline" onClick={handleReset} size="sm">
            <Repeat className="mr-1 h-4 w-4" /> Resetar
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="soilPH">pH do Solo</Label>
            <Slider
              id="soilPH"
              min={4.0}
              max={9.0}
              step={0.1}
              value={[paramData.soilPH]}
              onValueChange={(value) => handleParamChange('soilPH', value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>4.0 (Ácido)</span>
              <span>{paramData.soilPH}</span>
              <span>9.0 (Alcalino)</span>
            </div>
          </div>

          <div>
            <Label htmlFor="geneticType">Genética</Label>
            <Select
              value={paramData.geneticType}
              onValueChange={(value) => handleParamChange('geneticType', value)}
            >
              <SelectTrigger id="geneticType">
                <SelectValue placeholder="Selecione o tipo genético" />
              </SelectTrigger>
              <SelectContent>
                {GENETIC_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cultivationType">Tipo de Cultivo</Label>
            <Select
              value={paramData.cultivationType}
              onValueChange={(value) => handleParamChange('cultivationType', value)}
            >
              <SelectTrigger id="cultivationType">
                <SelectValue placeholder="Selecione o tipo de cultivo" />
              </SelectTrigger>
              <SelectContent>
                {CULTIVATION_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="usesAmendments"
              checked={paramData.usesAmendments}
              onCheckedChange={(checked) => handleParamChange('usesAmendments', checked)}
            />
            <Label htmlFor="usesAmendments">Usa corretivos de solo</Label>
          </div>

          <div>
            <Label htmlFor="experienceLevel">Nível de Experiência</Label>
            <Select
              value={paramData.experienceLevel}
              onValueChange={(value) => handleParamChange('experienceLevel', value)}
            >
              <SelectTrigger id="experienceLevel">
                <SelectValue placeholder="Selecione seu nível de experiência" />
              </SelectTrigger>
              <SelectContent>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="organicMatter">Matéria Orgânica (%)</Label>
            <Slider
              id="organicMatter"
              min={1}
              max={10}
              step={0.5}
              value={[paramData.organicMatter]}
              onValueChange={(value) => handleParamChange('organicMatter', value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1% (Baixo)</span>
              <span>{paramData.organicMatter}%</span>
              <span>10% (Alto)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showAdvanced"
              checked={paramData.usesAmendments}
              onCheckedChange={(checked) => handleParamChange('usesAmendments', checked)}
            />
            <Label htmlFor="showAdvanced">Mostrar opções avançadas</Label>
          </div>

          <div>
            <Label htmlFor="customNotes">Anotações</Label>
            <Textarea
              id="customNotes"
              value={paramData.customNotes}
              onChange={(e) => handleParamChange('customNotes', e.target.value)}
              placeholder="Informações adicionais sobre o solo..."
              className="resize-none"
            />
          </div>
          
          {handleCalculate && (
            <Button className="w-full mt-4" onClick={handleCalculateClick}>
              Calcular CEC
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CECParameters;

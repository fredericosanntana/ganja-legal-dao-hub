
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
  params: CECParametersType;
  onChange: (updatedParams: Partial<CECParametersType>) => void;
}

const CECParameters: React.FC<CECParametersProps> = ({
  params,
  onChange
}) => {
  const handleReset = () => {
    onChange(defaultCECParams);
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
              value={[params.soilPH]}
              onValueChange={(value) => onChange({ soilPH: value[0] })}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>4.0 (Ácido)</span>
              <span>{params.soilPH}</span>
              <span>9.0 (Alcalino)</span>
            </div>
          </div>

          <div>
            <Label htmlFor="geneticType">Genética</Label>
            <Select
              value={params.geneticType}
              onValueChange={(value) => onChange({ geneticType: value })}
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
              value={params.cultivationType}
              onValueChange={(value) => onChange({ cultivationType: value })}
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
              checked={params.usesAmendments}
              onCheckedChange={(checked) => onChange({ usesAmendments: checked })}
            />
            <Label htmlFor="usesAmendments">Usa corretivos de solo</Label>
          </div>

          <div>
            <Label htmlFor="experienceLevel">Nível de Experiência</Label>
            <Select
              value={params.experienceLevel}
              onValueChange={(value) => onChange({ experienceLevel: value })}
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
              value={[params.organicMatter]}
              onValueChange={(value) => onChange({ organicMatter: value[0] })}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1% (Baixo)</span>
              <span>{params.organicMatter}%</span>
              <span>10% (Alto)</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="showAdvanced"
              checked={params.usesAmendments}
              onCheckedChange={(checked) => onChange({ usesAmendments: checked })}
            />
            <Label htmlFor="showAdvanced">Mostrar opções avançadas</Label>
          </div>

          <div>
            <Label htmlFor="customNotes">Anotações</Label>
            <Textarea
              id="customNotes"
              value={params.customNotes}
              onChange={(e) => onChange({ customNotes: e.target.value })}
              placeholder="Informações adicionais sobre o solo..."
              className="resize-none"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CECParameters;

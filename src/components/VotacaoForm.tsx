
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { Proposta } from "@/types/votacoes";
import { calcularCustoQuadratico } from "@/services/votacoesService";

interface VotacaoFormProps {
  proposta: Proposta;
  totalVotos: number;
  creditosDisponiveis: number;
  onVotar: (propostaId: string, creditos: number) => void;
  disabled?: boolean;
}

const VotacaoForm: React.FC<VotacaoFormProps> = ({
  proposta,
  totalVotos,
  creditosDisponiveis,
  onVotar,
  disabled = false
}) => {
  const [creditosAlocados, setCreditosAlocados] = useState(0);
  const custoQuadratico = calcularCustoQuadratico(creditosAlocados);
  const porcentagemVotos = totalVotos > 0 ? (proposta.votos / totalVotos) * 100 : 0;

  const handleSliderChange = (values: number[]) => {
    const value = values[0];
    const custo = calcularCustoQuadratico(value);
    
    if (custo <= creditosDisponiveis) {
      setCreditosAlocados(value);
    } else {
      // Encontra o valor máximo que pode ser alocado com os créditos disponíveis
      let maxValue = Math.floor(Math.sqrt(creditosDisponiveis));
      setCreditosAlocados(maxValue);
    }
  };

  const handleVotar = () => {
    if (creditosAlocados > 0) {
      onVotar(proposta.id, custoQuadratico);
      setCreditosAlocados(0);
    }
  };

  const sliderMax = Math.floor(Math.sqrt(creditosDisponiveis));

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle>{proposta.titulo}</CardTitle>
          <Badge variant="outline">{proposta.votos} votos</Badge>
        </div>
        <CardDescription>{proposta.descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Distribuição atual</span>
            <span>{porcentagemVotos.toFixed(1)}%</span>
          </div>
          <Progress value={porcentagemVotos} className="h-2" />
        </div>

        {!disabled && (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Intensidade do voto: {creditosAlocados}</span>
                <span>Custo: {custoQuadratico} créditos</span>
              </div>
              <Slider
                defaultValue={[0]}
                value={[creditosAlocados]}
                max={sliderMax}
                step={1}
                onValueChange={handleSliderChange}
                disabled={disabled || creditosDisponiveis <= 0}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>{sliderMax}</span>
              </div>
            </div>

            <Button
              onClick={handleVotar}
              className="w-full"
              disabled={disabled || creditosAlocados === 0 || creditosDisponiveis < custoQuadratico}
            >
              Votar ({custoQuadratico} créditos)
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VotacaoForm;

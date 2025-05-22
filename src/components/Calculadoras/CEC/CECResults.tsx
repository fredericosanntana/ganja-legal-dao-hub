import React from "react";
import { CECResult } from "./CECUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Leaf, Scale } from "lucide-react";

interface CECResultsProps {
  showResults: boolean;
  results: CECResult | null;
}

const CECResults: React.FC<CECResultsProps> = ({ showResults, results }) => {
  if (!showResults || !results) {
    return (
      <div className="h-full flex items-center justify-center p-6 text-center">
        <p className="text-muted-foreground">
          Preencha os parâmetros e clique em calcular para ver os resultados da expectativa de cultivo.
        </p>
      </div>
    );
  }

  const getYieldAlertType = () => {
    if (results.totalYield > 200) return "high";
    if (results.totalYield > 100) return "medium";
    return "low";
  };

  const alertColors = {
    high: "bg-amber-500/20 border-amber-500 text-amber-500",
    medium: "bg-blue-500/20 border-blue-500 text-blue-500",
    low: "bg-green-500/20 border-green-500 text-green-500",
  };

  const alertType = getYieldAlertType();

  return (
    <div className="space-y-6">
      <div className={`p-4 rounded-lg border ${alertColors[alertType]}`}>
        <div className="flex items-center gap-2 mb-2">
          <Scale className="h-5 w-5" />
          <h3 className="text-lg font-medium">Rendimento Estimado</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Por planta</p>
            <p className="text-2xl font-bold">
              {results.yieldPerPlant}g
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">
              {results.totalYield}g
            </p>
          </div>
        </div>
        <div className="mt-2">
          <p className="text-sm text-muted-foreground">Faixa de rendimento possível</p>
          <p className="font-medium">
            {results.yieldRange.min}g - {results.yieldRange.max}g
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-medium">Detalhes da Produção</h3>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Rendimento por m²</p>
              <p className="font-medium">{results.yieldPerSquareMeter}g/m²</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ciclo estimado</p>
              <p className="font-medium">{results.estimatedCycle} dias</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Proporcionalidade Legal</h3>
        </div>
        <p className="text-sm">
          {results.proportionalityJustification}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          Sugestões para Melhorar Resultados
        </h3>
        <div className="space-y-2">
          {results.suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-2 p-2 bg-muted/20 rounded-md">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CECResults;

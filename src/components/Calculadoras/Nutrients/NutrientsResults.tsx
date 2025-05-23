
import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import StatusAlert from "../common/StatusAlert";

export interface NutrientsResultsProps {
  showResults: boolean;
  targetEC: number;
  resultEC: number;
  dosages: Record<string, { mlPerLiter: number; mlTotal: number; }>;
  incompatibilities: string[];
  schedule?: Record<string, number>;
}

const NutrientsResults: React.FC<NutrientsResultsProps> = ({
  showResults,
  targetEC,
  resultEC,
  dosages,
  incompatibilities,
  schedule = {}
}) => {
  if (!showResults) return null;

  const isECWithinRange = Math.abs(resultEC - targetEC) <= 0.2;
  
  // Formatted nutrient list for display
  const nutrientItems = Object.entries(dosages).map(([nutrient, { mlPerLiter, mlTotal }]) => ({
    name: nutrient,
    mlPerLiter: mlPerLiter.toFixed(1),
    mlTotal: mlTotal.toFixed(1),
  }));
  
  // Sort nutrients by total dosage
  nutrientItems.sort((a, b) => parseFloat(b.mlTotal) - parseFloat(a.mlTotal));
  
  // Calculate the irrigation schedule (simplified example)
  const hasSchedule = Object.keys(schedule).length > 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Resultado do Cálculo</CardTitle>
        <CardDescription>
          Dosagem recomendada para atingir EC {targetEC.toFixed(1)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* EC Status */}
        {isECWithinRange ? (
          <StatusAlert status="EC Ideal Atingido" type="success">
            <p>
              EC calculado: {resultEC.toFixed(1)} mS/cm (Meta: {targetEC.toFixed(1)} mS/cm)
            </p>
          </StatusAlert>
        ) : (
          <StatusAlert status="Atenção ao EC" type="warning">
            <p>
              EC calculado: {resultEC.toFixed(1)} mS/cm. {
                resultEC > targetEC 
                  ? "Superior ao ideal, considere diluir mais." 
                  : "Inferior ao ideal, considere aumentar a concentração."
              }
            </p>
          </StatusAlert>
        )}
        
        {/* Incompatibilities Warning */}
        {incompatibilities.length > 0 && (
          <StatusAlert status="Incompatibilidades Detectadas!" type="danger">
            <p>Os seguintes nutrientes não devem ser misturados diretamente:</p>
            <ul className="list-disc list-inside mt-1">
              {incompatibilities.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mt-1 text-sm">
              Recomendação: Aplique esses nutrientes separadamente ou com pelo menos 
              15 minutos de intervalo para evitar precipitação.
            </p>
          </StatusAlert>
        )}
        
        {/* Nutrients Table */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Dosagem de Nutrientes</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nutriente</TableHead>
                <TableHead>ml por Litro</TableHead>
                <TableHead>ml Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nutrientItems.map((item) => (
                <TableRow key={item.name}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.mlPerLiter} ml/L</TableCell>
                  <TableCell>{item.mlTotal} ml</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Irrigation Schedule */}
        {hasSchedule && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Cronograma de Irrigação</h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(schedule).map(([day, amount]) => (
                <Badge key={day} variant="outline" className="px-3 py-1">
                  {day}: {amount}L
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-4 p-4 bg-muted/30 rounded-md">
          <h3 className="text-sm font-semibold">Dicas de Aplicação</h3>
          <ul className="text-sm list-disc list-inside mt-1 space-y-1">
            <li>Sempre dilua os nutrientes em água, nunca aplique concentrado</li>
            <li>Meça o EC após cada adição para maior precisão</li>
            <li>Ajuste o pH após adicionar todos os nutrientes</li>
            <li>Para melhor absorção, mantenha o pH entre 5.8 e 6.3</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default NutrientsResults;

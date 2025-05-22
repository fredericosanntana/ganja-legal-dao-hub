import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LAMP_COMPARISON } from "./energyUtils";

const LampComparisonModal: React.FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Comparativo: LED vs HPS vs CFL
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Comparativo de Eficiência entre Lâmpadas</DialogTitle>
        </DialogHeader>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Tipo</th>
                <th className="p-2 text-left">Eficiência</th>
                <th className="p-2 text-left">Vida Útil</th>
                <th className="p-2 text-left">Geração de Calor</th>
                <th className="p-2 text-left">Custo Inicial</th>
                <th className="p-2 text-left">Custo Operacional</th>
              </tr>
            </thead>
            <tbody>
              {LAMP_COMPARISON.map((lamp, index) => (
                <tr key={index} className="border-b">
                  <td className="p-2 font-medium">{lamp.type}</td>
                  <td className="p-2">{lamp.efficiency}</td>
                  <td className="p-2">{lamp.lifespan}</td>
                  <td className="p-2">{lamp.heatGeneration}</td>
                  <td className="p-2">{lamp.initialCost}</td>
                  <td className="p-2">{lamp.operationalCost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 space-y-4">
          {LAMP_COMPARISON.map((lamp, index) => (
            <div key={index} className="space-y-1">
              <h4 className="font-medium">{lamp.type}</h4>
              <p className="text-sm"><strong>Vantagens:</strong> {lamp.pros}</p>
              <p className="text-sm"><strong>Desvantagens:</strong> {lamp.cons}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LampComparisonModal;

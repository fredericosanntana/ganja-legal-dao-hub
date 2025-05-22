
import React, { useState, useEffect } from "react";
import { Zap } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import CalculatorCard from "../common/CalculatorCard";
import EnergyParameters from "./EnergyParameters";
import EnergyResults from "./EnergyResults";
import EnergyChart from "./EnergyChart";
import LampComparisonModal from "./LampComparisonModal";
import {
  EquipmentItem,
  EnergyCalculationResult,
  DEFAULT_KWH_PRICE,
  calculateEnergyResults,
  generateConsumptionChartData,
  generateEfficiencyTips
} from "./energyUtils";

const EnergyCalculator: React.FC = () => {
  const [equipmentList, setEquipmentList] = useState<EquipmentItem[]>([
    {
      id: uuidv4(),
      name: "LED 600W",
      power: 600,
      hoursPerDay: 18,
      daysPerMonth: 30,
      quantity: 1
    },
    {
      id: uuidv4(),
      name: "Exaustor médio",
      power: 40,
      hoursPerDay: 24,
      daysPerMonth: 30,
      quantity: 1
    }
  ]);
  
  const [kwhPrice, setKwhPrice] = useState<number>(DEFAULT_KWH_PRICE);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [results, setResults] = useState<EnergyCalculationResult | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [efficiencyTips, setEfficiencyTips] = useState<string[]>([]);

  const addEquipment = () => {
    setEquipmentList([
      ...equipmentList,
      {
        id: uuidv4(),
        name: "",
        power: 0,
        hoursPerDay: 12,
        daysPerMonth: 30,
        quantity: 1
      }
    ]);
  };

  const removeEquipment = (id: string) => {
    setEquipmentList(equipmentList.filter(item => item.id !== id));
  };

  const updateEquipment = (id: string, field: keyof EquipmentItem, value: any) => {
    const updatedList = equipmentList.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    );
    setEquipmentList([...updatedList]);
  };

  const handleCalculate = () => {
    const calculationResults = calculateEnergyResults(equipmentList, kwhPrice);
    const chartData = generateConsumptionChartData(calculationResults.equipmentBreakdown);
    const tips = generateEfficiencyTips(equipmentList);
    
    setResults(calculationResults);
    setChartData(chartData);
    setEfficiencyTips(tips);
    setShowResults(true);
  };

  return (
    <CalculatorCard
      icon={Zap}
      title="Calculadora de Consumo de Energia"
      description="Calcule o consumo e custo de energia do seu cultivo"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parâmetros */}
        <div className="space-y-4">
          <EnergyParameters
            equipmentList={equipmentList}
            addEquipment={addEquipment}
            removeEquipment={removeEquipment}
            updateEquipment={updateEquipment}
            kwhPrice={kwhPrice}
            setKwhPrice={setKwhPrice}
            handleCalculate={handleCalculate}
          />
        </div>

        {/* Resultados */}
        <div className="space-y-4">
          <EnergyResults
            showResults={showResults}
            results={results}
            efficiencyTips={efficiencyTips}
          />
        </div>

        {/* Gráficos e Comparativo */}
        <div className="space-y-4 md:col-span-2">
          <EnergyChart
            showResults={showResults}
            chartData={chartData}
          />
          
          {showResults && (
            <div className="mt-4">
              <LampComparisonModal />
              
              <div className="mt-4 bg-muted/20 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Informações Adicionais</h3>
                <p className="text-sm mb-2">
                  Esta calculadora pode ajudar a:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  <li>Reduzir custos do cultivo caseiro</li>
                  <li>Fornecer prova de consumo energético proporcional (estratégia de autoproteção legal)</li>
                  <li>Promover conscientização ecológica e otimização do uso de energia</li>
                </ul>
                
                <p className="text-sm mt-3">
                  Lembre-se que o consumo real pode variar dependendo da eficiência dos equipamentos, 
                  flutuações na rede elétrica e outros fatores ambientais.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </CalculatorCard>
  );
};

export default EnergyCalculator;

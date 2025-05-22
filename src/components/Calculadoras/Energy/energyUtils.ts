// Funções utilitárias para a calculadora de consumo de energia
export interface EquipmentItem {
  id: string;
  name: string;
  power: number; // em watts
  hoursPerDay: number;
  daysPerMonth: number;
  quantity: number;
}

export interface EnergyCalculationResult {
  monthlyConsumption: number; // em kWh
  monthlyCost: number; // em R$
  totalConsumption: number; // em kWh
  co2Emission: number; // em kg
  equipmentBreakdown: { name: string; consumption: number; cost: number }[];
}

// Constantes para cálculos
export const DEFAULT_KWH_PRICE = 0.95; // R$ por kWh
export const CO2_EMISSION_FACTOR = 0.09; // kg de CO2 por kWh (média brasileira aproximada)

// Equipamentos comuns pré-definidos
export const COMMON_EQUIPMENT = [
  { name: "LED 100W", power: 100 },
  { name: "LED 200W", power: 200 },
  { name: "LED 400W", power: 400 },
  { name: "LED 600W", power: 600 },
  { name: "LED 1000W", power: 1000 },
  { name: "HPS 250W", power: 275 }, // Inclui consumo do reator
  { name: "HPS 400W", power: 440 }, // Inclui consumo do reator
  { name: "HPS 600W", power: 660 }, // Inclui consumo do reator
  { name: "HPS 1000W", power: 1100 }, // Inclui consumo do reator
  { name: "Exaustor pequeno", power: 20 },
  { name: "Exaustor médio", power: 40 },
  { name: "Exaustor grande", power: 80 },
  { name: "Ventilador pequeno", power: 15 },
  { name: "Ventilador médio", power: 30 },
  { name: "Ventilador grande", power: 60 },
  { name: "Bomba de água pequena", power: 10 },
  { name: "Bomba de água média", power: 25 },
  { name: "Bomba de água grande", power: 50 },
  { name: "Ar condicionado 9000 BTU", power: 820 },
  { name: "Ar condicionado 12000 BTU", power: 1100 },
  { name: "Desumidificador pequeno", power: 200 },
  { name: "Desumidificador médio", power: 400 },
  { name: "Umidificador", power: 40 },
  { name: "Aquecedor pequeno", power: 500 },
  { name: "Aquecedor médio", power: 1000 },
];

// Calcular consumo mensal de um equipamento em kWh
export const calculateEquipmentConsumption = (equipment: EquipmentItem): number => {
  return (equipment.power * equipment.hoursPerDay * equipment.daysPerMonth * equipment.quantity) / 1000;
};

// Calcular custo mensal de um equipamento
export const calculateEquipmentCost = (consumption: number, kwhPrice: number): number => {
  return consumption * kwhPrice;
};

// Calcular emissão de CO2
export const calculateCO2Emission = (consumption: number): number => {
  return consumption * CO2_EMISSION_FACTOR;
};

// Calcular todos os resultados
export const calculateEnergyResults = (
  equipmentList: EquipmentItem[],
  kwhPrice: number
): EnergyCalculationResult => {
  // Calcular consumo e custo por equipamento
  const equipmentBreakdown = equipmentList.map(equipment => {
    const consumption = calculateEquipmentConsumption(equipment);
    const cost = calculateEquipmentCost(consumption, kwhPrice);
    return {
      name: equipment.name,
      consumption,
      cost
    };
  });

  // Calcular totais
  const monthlyConsumption = equipmentBreakdown.reduce((sum, item) => sum + item.consumption, 0);
  const monthlyCost = equipmentBreakdown.reduce((sum, item) => sum + item.cost, 0);
  const totalConsumption = monthlyConsumption; // Pode ser ajustado para ciclo completo
  const co2Emission = calculateCO2Emission(monthlyConsumption);

  return {
    monthlyConsumption,
    monthlyCost,
    totalConsumption,
    co2Emission,
    equipmentBreakdown
  };
};

// Gerar dados para o gráfico de consumo por equipamento
export const generateConsumptionChartData = (equipmentBreakdown: { name: string; consumption: number; cost: number }[]) => {
  return {
    labels: equipmentBreakdown.map(item => item.name),
    datasets: [
      {
        label: 'Consumo (kWh)',
        data: equipmentBreakdown.map(item => item.consumption),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      },
      {
        label: 'Custo (R$)',
        data: equipmentBreakdown.map(item => item.cost),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
};

// Gerar dicas de eficiência energética baseadas nos equipamentos
export const generateEfficiencyTips = (equipmentList: EquipmentItem[]): string[] => {
  const tips: string[] = [];
  
  // Verificar se há lâmpadas HPS
  if (equipmentList.some(item => item.name.includes('HPS'))) {
    tips.push('Considere substituir lâmpadas HPS por LED para economizar até 40% de energia.');
  }
  
  // Verificar se há equipamentos ligados 24h
  if (equipmentList.some(item => item.hoursPerDay === 24)) {
    tips.push('Use timers para equipamentos que não precisam ficar ligados 24h, como exaustores e ventiladores.');
  }
  
  // Verificar se há muitos equipamentos de ventilação
  const ventilationEquipment = equipmentList.filter(item => 
    item.name.includes('Exaustor') || 
    item.name.includes('Ventilador')
  );
  
  if (ventilationEquipment.length > 2) {
    tips.push('Otimize seu sistema de ventilação. Muitas vezes um exaustor potente é mais eficiente que vários pequenos.');
  }
  
  // Verificar se há ar condicionado
  if (equipmentList.some(item => item.name.includes('Ar condicionado'))) {
    tips.push('Ar condicionados consomem muita energia. Considere isolamento térmico e ventilação passiva quando possível.');
  }
  
  // Dicas gerais
  tips.push('Mantenha seus equipamentos limpos, especialmente ventiladores e exaustores, para maior eficiência.');
  tips.push('Considere usar refletores de alta qualidade para maximizar a eficiência luminosa.');
  tips.push('Verifique se sua instalação elétrica está adequada para evitar perdas por resistência.');
  
  return tips;
};

// Comparação entre diferentes tipos de lâmpadas
export const LAMP_COMPARISON = [
  {
    type: 'LED',
    efficiency: 'Alta (1.8-2.2 μmol/J)',
    lifespan: '50.000-100.000 horas',
    heatGeneration: 'Baixa',
    initialCost: 'Alto',
    operationalCost: 'Baixo',
    pros: 'Baixo consumo, pouco calor, longa vida útil',
    cons: 'Investimento inicial alto'
  },
  {
    type: 'HPS',
    efficiency: 'Média (1.0-1.7 μmol/J)',
    lifespan: '10.000-24.000 horas',
    heatGeneration: 'Alta',
    initialCost: 'Médio',
    operationalCost: 'Alto',
    pros: 'Bom espectro para floração, custo inicial menor',
    cons: 'Alto consumo, gera muito calor, troca frequente de lâmpadas'
  },
  {
    type: 'CFL',
    efficiency: 'Baixa (0.5-0.9 μmol/J)',
    lifespan: '6.000-10.000 horas',
    heatGeneration: 'Média',
    initialCost: 'Baixo',
    operationalCost: 'Médio',
    pros: 'Baixo custo inicial, bom para espaços pequenos',
    cons: 'Baixa eficiência, penetração de luz limitada'
  }
];

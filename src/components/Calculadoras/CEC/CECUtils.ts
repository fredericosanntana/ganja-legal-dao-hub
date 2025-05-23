// Funções utilitárias para a Calculadora de Expectativa de Cultivo (CEC)

export interface CECParameters {
  geneticType: string; // Feminizada, Regular, Autoflorescente
  cycleDays: number; // Dias de vegetação + floração
  plantCount: number; // Número de plantas
  potSize: number; // Tamanho dos vasos em litros
  cultivationType: string; // Solo vivo, Hidroponia, Orgânico, Indoor LED, Outdoor
  controlledEnvironment: boolean; // Ambiente controlado?
  growerExperience: string; // Iniciante, Intermediário, Avançado
  lightCoverage: number; // W reais por planta ou m²
  nutritionControl: boolean; // Com controle, Sem controle
  observations: string; // Observações livres (opcional)
  
  soilType: string; // Tipo de solo: Arenoso, Franco, Argiloso, etc.
  soilPH: number; // pH do solo
  organicMatter: number; // Porcentagem de matéria orgânica
  clayContent: number; // Porcentagem de argila
  experienceLevel: string; // Nível de experiência: Iniciante, Intermediário, Avançado
  desiredCEC: number; // CEC desejado em meq/100g
}

export interface CECResult {
  yieldPerPlant: number; // Rendimento estimado por planta (g)
  totalYield: number; // Rendimento total estimado (g)
  yieldPerSquareMeter: number; // Rendimento por m² (g/m²)
  proportionalityJustification: string; // Proporcionalidade da produção (justificativa legal)
  yieldRange: { min: number; max: number }; // Rendimento ideal x rendimento possível (faixa)
  estimatedCycle: number; // Ciclo estimado completo (dias)
  suggestions: string[]; // Sugestões de ajuste para melhorar o resultado
  chartData: any; // Dados para o gráfico de projeção
}

// Fatores de multiplicação para cada tipo de genética
const GENETIC_FACTORS = {
  "Feminizada": 1.0,
  "Regular": 0.85, // Menor rendimento devido à variabilidade
  "Autoflorescente": 0.7 // Geralmente menor rendimento que as fotodependentes
};

// Fatores de multiplicação para cada tipo de cultivo
const CULTIVATION_FACTORS = {
  "Solo vivo": 1.2,
  "Hidroponia": 1.1,
  "Orgânico": 0.9,
  "Indoor LED": 1.0,
  "Outdoor": 0.8
};

// Fatores de multiplicação para experiência do cultivador
const EXPERIENCE_FACTORS = {
  "Iniciante": 0.7,
  "Intermediário": 1.0,
  "Avançado": 1.3
};

// Calcular rendimento base por planta
export const calculateBaseYield = (params: CECParameters): number => {
  let baseYield = 0;
  
  // Cálculo base para indoor com LED
  if (params.cultivationType === "Indoor LED") {
    // Rendimento base entre 0.5g e 1.2g por watt
    const baseYieldPerWatt = params.controlledEnvironment ? 1.0 : 0.7;
    baseYield = params.lightCoverage * baseYieldPerWatt;
  } 
  // Cálculo base para outdoor
  else if (params.cultivationType === "Outdoor") {
    // Rendimento base entre 30g e 100g por planta
    baseYield = params.controlledEnvironment ? 80 : 50;
  }
  // Cálculo para outros tipos de cultivo
  else {
    // Rendimento base entre 50g e 200g dependendo do tipo
    const baseFactor = params.cultivationType === "Solo vivo" ? 150 : 100;
    baseYield = params.controlledEnvironment ? baseFactor : baseFactor * 0.7;
  }
  
  return baseYield;
};

// Aplicar fatores de ajuste ao rendimento base
export const applyYieldFactors = (baseYield: number, params: CECParameters): number => {
  let adjustedYield = baseYield;
  
  // Aplicar fator de genética
  adjustedYield *= GENETIC_FACTORS[params.geneticType] || 1.0;
  
  // Aplicar fator de cultivo
  adjustedYield *= CULTIVATION_FACTORS[params.cultivationType] || 1.0;
  
  // Aplicar fator de experiência
  adjustedYield *= EXPERIENCE_FACTORS[params.growerExperience] || 1.0;
  
  // Ajuste pelo tamanho do vaso (maior vaso = maior potencial)
  const potSizeFactor = Math.min(1.5, Math.max(0.5, params.potSize / 15));
  adjustedYield *= potSizeFactor;
  
  // Ajuste pela nutrição
  adjustedYield *= params.nutritionControl ? 1.2 : 0.9;
  
  return adjustedYield;
};

// Calcular faixa de rendimento (mínimo e máximo)
export const calculateYieldRange = (yield_: number): { min: number; max: number } => {
  return {
    min: Math.round(yield_ * 0.7), // 70% do rendimento calculado
    max: Math.round(yield_ * 1.3)  // 130% do rendimento calculado
  };
};

// Gerar justificativa de proporcionalidade
export const generateProportionalityJustification = (totalYield: number, params: CECParameters): string => {
  const dailyConsumption = Math.round(totalYield / 90); // Estimativa para 3 meses
  
  return `A produção estimada de ${totalYield}g é proporcional para uso pessoal, ` +
         `representando aproximadamente ${dailyConsumption}g/dia ao longo de 3 meses. ` +
         `Este volume é compatível com o autocultivo para uso medicinal/terapêutico ` +
         `considerando ${params.plantCount} plantas em ambiente ${params.controlledEnvironment ? 'controlado' : 'não controlado'}.`;
};

// Gerar sugestões de melhoria
export const generateSuggestions = (params: CECParameters): string[] => {
  const suggestions = [];
  
  if (params.potSize < 10) {
    suggestions.push("Considere aumentar o tamanho dos vasos para pelo menos 10L para melhor desenvolvimento radicular.");
  }
  
  if (params.cultivationType === "Indoor LED" && params.lightCoverage < 30) {
    suggestions.push("Aumente a cobertura de luz para pelo menos 30W por planta para melhorar o rendimento.");
  }
  
  if (!params.controlledEnvironment) {
    suggestions.push("Implementar controle de ambiente (temperatura e umidade) pode aumentar o rendimento em até 30%.");
  }
  
  if (!params.nutritionControl) {
    suggestions.push("Adicionar controle de nutrição com medição de EC/PPM pode melhorar significativamente a qualidade e quantidade da colheita.");
  }
  
  if (params.growerExperience === "Iniciante") {
    suggestions.push("Considere começar com genéticas mais resistentes e fornecer suporte adequado às plantas durante o crescimento.");
  }
  
  // Sempre adicionar pelo menos uma sugestão genérica
  suggestions.push("Mantenha um diário de cultivo para registrar o desenvolvimento e aprender com cada ciclo.");
  
  return suggestions;
};

// Gerar dados para o gráfico de projeção
export const generateChartData = (params: CECParameters, yieldPerPlant: number): any => {
  const labels = [];
  const vegetativeData = [];
  const floweringData = [];
  
  // Estimar dias de vegetação e floração
  let vegDays, flowerDays;
  
  if (params.geneticType === "Autoflorescente") {
    vegDays = Math.round(params.cycleDays * 0.3);
    flowerDays = params.cycleDays - vegDays;
  } else {
    vegDays = Math.round(params.cycleDays * 0.4);
    flowerDays = params.cycleDays - vegDays;
  }
  
  // Gerar dados para fase vegetativa (crescimento linear)
  for (let day = 0; day <= vegDays; day++) {
    labels.push(`Dia ${day}`);
    vegetativeData.push(0); // Sem produção na fase vegetativa
    floweringData.push(null);
  }
  
  // Gerar dados para fase de floração (crescimento sigmoidal)
  for (let day = vegDays + 1; day <= params.cycleDays; day++) {
    labels.push(`Dia ${day}`);
    vegetativeData.push(null);
    
    // Cálculo sigmoidal para simular crescimento de flores
    const flowerDay = day - vegDays;
    const progress = flowerDay / flowerDays;
    const sigmoid = 1 / (1 + Math.exp(-12 * (progress - 0.5)));
    floweringData.push(Math.round(yieldPerPlant * sigmoid * 10) / 10);
  }
  
  return {
    labels,
    datasets: [
      {
        label: 'Fase Vegetativa',
        data: vegetativeData,
        borderColor: '#8BC34A',
        backgroundColor: 'rgba(139, 195, 74, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true
      },
      {
        label: 'Fase de Floração',
        data: floweringData,
        borderColor: '#C5A942',
        backgroundColor: 'rgba(197, 169, 66, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        fill: true
      }
    ]
  };
};

// Função principal para calcular todos os resultados
export const calculateCECResults = (params: CECParameters): CECResult => {
  // Calcular rendimento base por planta
  const baseYield = calculateBaseYield(params);
  
  // Aplicar fatores de ajuste
  const adjustedYieldPerPlant = applyYieldFactors(baseYield, params);
  
  // Calcular rendimento total
  const totalYield = Math.round(adjustedYieldPerPlant * params.plantCount);
  
  // Estimar área ocupada (m²) - aproximação simples
  const estimatedArea = Math.max(1, Math.ceil(params.plantCount / 4));
  
  // Calcular rendimento por m²
  const yieldPerSquareMeter = Math.round(totalYield / estimatedArea);
  
  // Calcular faixa de rendimento
  const yieldRange = calculateYieldRange(totalYield);
  
  // Gerar justificativa de proporcionalidade
  const proportionalityJustification = generateProportionalityJustification(totalYield, params);
  
  // Gerar sugestões de melhoria
  const suggestions = generateSuggestions(params);
  
  // Gerar dados para o gráfico
  const chartData = generateChartData(params, adjustedYieldPerPlant);
  
  return {
    yieldPerPlant: Math.round(adjustedYieldPerPlant),
    totalYield,
    yieldPerSquareMeter,
    proportionalityJustification,
    yieldRange,
    estimatedCycle: params.cycleDays,
    suggestions,
    chartData
  };
};

// Valores padrão para os parâmetros
export const DEFAULT_PARAMETERS: CECParameters = {
  geneticType: "Feminizada",
  cycleDays: 90,
  plantCount: 2,
  potSize: 11,
  cultivationType: "Indoor LED",
  controlledEnvironment: true,
  growerExperience: "Intermediário",
  lightCoverage: 100,
  nutritionControl: true,
  observations: "",
  
  soilType: "loamy",
  soilPH: 6.5,
  organicMatter: 3,
  clayContent: 20,
  experienceLevel: "intermediate",
  desiredCEC: 15,
};

// Opções para os campos de seleção
export const GENETIC_TYPES = ["Feminizada", "Regular", "Autoflorescente"];
export const CULTIVATION_TYPES = ["Solo vivo", "Hidroponia", "Orgânico", "Indoor LED", "Outdoor"];
export const EXPERIENCE_LEVELS = ["Iniciante", "Intermediário", "Avançado"];

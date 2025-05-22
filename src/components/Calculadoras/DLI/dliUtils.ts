// Funções utilitárias para DLI Calculator
export const luxToPPFD = (lux: number, lightType: string): number => {
  const conversionFactors = {
    hps: 0.0155,
    led: 0.0185,
    cmh: 0.0165,
    fluorescente: 0.0135,
    sol: 0.0205
  };
  return lux * (conversionFactors[lightType as keyof typeof conversionFactors] || 0.0155);
};

export const adjustPPFDForDistance = (ppfd: number, referenceDistance: number, currentDistance: number): number => {
  return ppfd * Math.pow(referenceDistance / currentDistance, 2);
};

export const calculateDLI = (ppfd: number, hoursOfLight: number): number => {
  return (ppfd * hoursOfLight * 3600) / 1000000; // Convertendo para mol/m²/dia
};

export const getDLIZone = (dli: number, stage: string): string => {
  const zones = {
    mudas: { tooLow: 12, low: 20, high: 30, tooHigh: 40 },
    vegetativo: { tooLow: 20, low: 30, high: 45, tooHigh: 55 },
    floracao: { tooLow: 30, low: 40, high: 55, tooHigh: 65 }
  };
  
  const stageZones = zones[stage as keyof typeof zones];
  if (dli < stageZones.tooLow) return 'tooLow';
  if (dli < stageZones.low) return 'low';
  if (dli > stageZones.tooHigh) return 'tooHigh';
  if (dli > stageZones.high) return 'high';
  return 'optimal';
};

export const generateDLIRecommendations = (
  dli: number,
  zone: string,
  ppfd: number,
  hoursOfLight: number,
  stage: string
) => {
  const actions = [];
  let status = '';

  switch (zone) {
    case 'tooLow':
      status = 'DLI muito baixo';
      actions.push('Aumente a intensidade da luz');
      actions.push('Considere aumentar as horas de luz');
      break;
    case 'low':
      status = 'DLI baixo';
      actions.push('Considere aumentar a intensidade da luz');
      if (hoursOfLight < 18) actions.push('Aumente as horas de luz');
      break;
    case 'optimal':
      status = 'DLI ótimo';
      actions.push('Mantenha as condições atuais');
      break;
    case 'high':
      status = 'DLI alto';
      actions.push('Considere reduzir a intensidade da luz');
      if (hoursOfLight > 12) actions.push('Reduza as horas de luz');
      break;
    case 'tooHigh':
      status = 'DLI muito alto';
      actions.push('Reduza a intensidade da luz imediatamente');
      actions.push('Reduza as horas de luz');
      break;
  }

  // Recomendações específicas por estágio
  if (stage === 'mudas') {
    actions.push('Mantenha as mudas a uma distância segura da luz');
    actions.push('Monitore sinais de estresse');
  } else if (stage === 'vegetativo') {
    actions.push('Ajuste a altura das luzes conforme a planta cresce');
  } else if (stage === 'floracao') {
    actions.push('Mantenha a intensidade consistente durante a floração');
    actions.push('Evite mudanças bruscas no fotoperíodo');
  }

  return { status, actions };
};

export const estimateEnergyConsumption = (
  ppfd: number,
  area: number,
  lightType: string,
  hoursOfLight: number
): number => {
  const efficiencyFactors = {
    hps: 1.0,
    led: 0.6,
    cmh: 0.8,
    fluorescente: 0.7,
    sol: 0
  };

  const wattsPerSquareMeter = (ppfd * area) / 2; // Estimativa aproximada
  return wattsPerSquareMeter * (efficiencyFactors[lightType as keyof typeof efficiencyFactors] || 1) * hoursOfLight / 1000;
};

export const generateLightCurveData = (ppfd: number, hoursOfLight: number) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const lightStart = Math.floor((24 - hoursOfLight) / 2);
  const lightEnd = lightStart + hoursOfLight;
  
  return {
    labels: hours.map(h => `${h}:00`),
    datasets: [{
      label: 'PPFD (μmol/m²/s)',
      data: hours.map(h => (h >= lightStart && h < lightEnd) ? ppfd : 0),
      backgroundColor: 'rgba(75, 192, 192, 0.6)'
    }]
  };
};

export const generateDLIComparisonData = (currentDLI: number) => {
  const stages = ['Mudas', 'Vegetativo', 'Floração'];
  const referenceDLIs = [16, 30, 45]; // Valores de referência para cada estágio
  return {
    labels: stages,
    datasets: [
      {
        label: 'DLI Atual',
        data: stages.map(() => currentDLI),
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      },
      {
        label: 'DLI Ideal',
        data: referenceDLIs,
        backgroundColor: 'rgba(153, 102, 255, 0.6)'
      }
    ]
  };
};

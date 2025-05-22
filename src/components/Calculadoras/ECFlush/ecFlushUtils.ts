// Funções utilitárias para EC Flush Calculator
export const TARGET_FLUSH_EC = 0.4; // EC alvo após flush completo

export const convertToEC = (value: number, unit: string): number => {
  if (unit === 'ec') return value;
  if (unit === 'ppm500') return value / 500;
  if (unit === 'ppm700') return value / 700;
  return value;
};

export const calculateWaterVolume = (potSize: number, substrate: string): number => {
  const multipliers = {
    solo: 3,
    coco: 2.5,
    hidroponia: 2
  };
  return potSize * (multipliers[substrate as keyof typeof multipliers] || 3);
};

export const calculateNumberOfFlushes = (currentEC: number, targetEC: number, substrate: string): number => {
  const efficiencyFactors = {
    solo: 0.6,
    coco: 0.7,
    hidroponia: 0.8
  };
  
  const efficiency = efficiencyFactors[substrate as keyof typeof efficiencyFactors] || 0.6;
  const reductionPerFlush = 1 - efficiency;
  
  let remainingEC = currentEC;
  let flushCount = 0;
  
  while (remainingEC > targetEC && flushCount < 10) {
    remainingEC *= reductionPerFlush;
    flushCount++;
  }
  
  return Math.min(flushCount, 5); // Limitar a 5 flushes
};

export const generateECReductionSchedule = (
  currentEC: number,
  targetEC: number,
  daysRemaining: number,
  flushCount: number
) => {
  const schedule = [];
  const daysPerFlush = Math.floor(daysRemaining / flushCount);
  let remainingEC = currentEC;
  
  for (let i = 0; i < flushCount; i++) {
    const day = i * daysPerFlush + 1;
    remainingEC *= 0.6; // Redução de 60% por flush
    
    schedule.push({
      day,
      ec: remainingEC.toFixed(2),
      action: `Realizar flush ${i + 1} de ${flushCount}`
    });
  }
  
  return schedule;
};

export const generateFlushRecommendations = (
  currentEC: number,
  waterEC: number,
  daysRemaining: number,
  flushCount: number
) => {
  const actions = [];
  let status = '';
  
  if (currentEC > 2.5) {
    status = 'EC muito alta - Flush urgente necessário';
    actions.push('Realize o primeiro flush imediatamente');
    actions.push('Monitore a EC do runoff após cada flush');
  } else if (currentEC > 1.5) {
    status = 'EC elevada - Flush recomendado';
    actions.push(`Realize ${flushCount} flushes nos próximos ${daysRemaining} dias`);
    actions.push('Monitore a EC do runoff após cada flush');
  } else {
    status = 'EC dentro do intervalo aceitável';
    actions.push('Continue monitorando a EC regularmente');
    actions.push('Realize flushes apenas se necessário');
  }
  
  if (waterEC > 0.3) {
    actions.push('Considere usar água com EC mais baixa');
  }
  
  actions.push('Mantenha a temperatura e umidade adequadas');
  actions.push('Evite fertilizantes durante o período de flush');
  
  return { status, actions };
};

export const generateSubstrateInstructions = (
  substrate: string,
  waterVolume: number,
  flushCount: number
) => {
  const instructions = {
    solo: [
      'Regue lentamente para evitar compactação do solo',
      'Permita drenagem completa entre os flushes',
      'Monitore a umidade do solo entre os flushes',
      'Evite deixar água parada no prato'
    ],
    coco: [
      'Regue até 20% de runoff',
      'Mantenha o coco sempre úmido',
      'Use água com pH ajustado (5.8-6.2)',
      'Evite deixar o coco secar completamente'
    ],
    hidroponia: [
      'Drene completamente o sistema',
      'Encha com água limpa',
      'Recircule por 1-2 horas',
      'Drene e repita o processo'
    ]
  };
  
  return instructions[substrate as keyof typeof instructions] || instructions.solo;
};

export const generateECReductionChartData = (schedule: any[]) => {
  return {
    labels: schedule.map(item => `Dia ${item.day}`),
    datasets: [
      {
        label: 'EC Projetada',
        data: schedule.map(item => parseFloat(item.ec)),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'EC Alvo',
        data: schedule.map(() => TARGET_FLUSH_EC),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0
      }
    ]
  };
};

export const generateFlushEfficiencyChartData = (substrate: string, currentEC: number, targetEC: number) => {
  const efficiencyFactors = {
    solo: 0.6,
    coco: 0.7,
    hidroponia: 0.8
  };
  
  const efficiency = efficiencyFactors[substrate as keyof typeof efficiencyFactors] || 0.6;
  const flushCount = 5;
  const data = [];
  let remainingEC = currentEC;
  
  for (let i = 0; i <= flushCount; i++) {
    data.push(remainingEC);
    remainingEC *= (1 - efficiency);
  }
  
  return {
    labels: Array.from({ length: flushCount + 1 }, (_, i) => `Flush ${i}`),
    datasets: [
      {
        label: 'EC após cada flush',
        data,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'EC Alvo',
        data: Array(flushCount + 1).fill(targetEC),
        borderColor: 'rgb(255, 99, 132)',
        borderDash: [5, 5],
        tension: 0
      }
    ]
  };
};

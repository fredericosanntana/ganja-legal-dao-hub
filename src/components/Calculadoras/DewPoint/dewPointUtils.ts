// Funções utilitárias para DewPoint Calculator
export const calculateDewPoint = (T: number, RH: number) => {
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * T) / (b + T) + Math.log(RH / 100);
  return (b * alpha) / (a - alpha);
};

export const calculateMoldRisk = (temperature: number, dewPoint: number) => {
  const difference = temperature - dewPoint;
  if (difference < 2) return 'alto';
  if (difference < 4) return 'medio';
  return 'baixo';
};

export const estimateDryingRate = (
  temperature: number,
  humidity: number,
  density: string,
  airflow: string
) => {
  // Base rate: % de umidade perdida por dia
  let baseRate = 7;
  
  // Ajustes por temperatura
  if (temperature < 15) baseRate *= 0.7;
  else if (temperature > 21) baseRate *= 1.3;
  
  // Ajustes por umidade
  if (humidity < 45) baseRate *= 1.3;
  else if (humidity > 65) baseRate *= 0.7;
  
  // Ajustes por densidade
  const densityFactor = density === 'denso' ? 0.7 : density === 'medio' ? 1 : 1.3;
  
  // Ajustes por circulação de ar
  const airflowFactor = airflow === 'alta' ? 1.3 : airflow === 'media' ? 1 : 0.7;
  
  const dailyRate = baseRate * densityFactor * airflowFactor;
  const estimatedDays = 70 / dailyRate; // Estimativa para secar de ~70% para ~10%
  
  return { dailyRate, estimatedDays };
};

export const generateDewPointRecommendations = (
  temperature: number,
  humidity: number,
  dewPoint: number,
  moldRisk: string,
  dryingRate: { dailyRate: number, estimatedDays: number },
  phase: string,
  density: string,
  airflow: string
) => {
  const actions = [];
  let status = '';
  
  // Status baseado no risco de mofo
  if (moldRisk === 'alto') {
    status = 'Alto risco de mofo - Ajuste necessário';
    actions.push('Reduza a umidade do ambiente');
    actions.push('Aumente a temperatura');
    actions.push('Melhore a circulação de ar');
  } else if (moldRisk === 'medio') {
    status = 'Risco moderado de mofo - Monitore de perto';
    actions.push('Monitore a umidade do ambiente');
    actions.push('Mantenha boa circulação de ar');
  } else {
    status = 'Condições ideais para esta fase';
    actions.push('Mantenha as condições atuais');
  }
  
  // Recomendações específicas por fase
  if (phase === 'secagemInicial') {
    actions.push('Mantenha boa circulação de ar');
    actions.push('Evite luz direta');
  } else if (phase === 'secagemMedia') {
    actions.push('Reduza gradualmente a circulação de ar');
    actions.push('Monitore a umidade diariamente');
  } else if (phase === 'cura') {
    actions.push('Armazene em recipientes herméticos');
    actions.push('Abra os recipientes diariamente para troca de ar');
  }

  return { status, actions };
};

export const generateSchedule = (density: string) => {
  const baseDays = {
    secagemInicial: { dias: 4, temperatura: '15-21°C', umidade: '45-60%' },
    secagemMedia: { dias: 6, temperatura: '15-21°C', umidade: '50-65%' },
    cura: { dias: 14, temperatura: '15-21°C', umidade: '58-65%' }
  };

  // Ajustar dias baseado na densidade
  const densityFactor = density === 'denso' ? 1.2 : density === 'medio' ? 1 : 0.8;
  
  return {
    secagemInicial: {
      ...baseDays.secagemInicial,
      dias: Math.round(baseDays.secagemInicial.dias * densityFactor)
    },
    secagemMedia: {
      ...baseDays.secagemMedia,
      dias: Math.round(baseDays.secagemMedia.dias * densityFactor)
    },
    cura: {
      ...baseDays.cura,
      dias: Math.round(baseDays.cura.dias * densityFactor)
    }
  };
};

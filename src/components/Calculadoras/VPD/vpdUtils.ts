// Funções utilitárias para VPD Calculator
export const VPD_RANGES = {
  vegetativo: { min: 0.8, max: 1.2 },
  floracaoInicial: { min: 1.0, max: 1.4 },
  floracaoTardia: { min: 1.2, max: 1.6 }
};

export const calculateVPD = (leafTemp: number, airTemp: number, humidity: number): number => {
  const svpLeaf = 610.7 * Math.pow(10, (7.5 * leafTemp) / (237.3 + leafTemp));
  const svpAir = 610.7 * Math.pow(10, (7.5 * airTemp) / (237.3 + airTemp));
  const vpAir = (svpAir * humidity) / 100;
  return (svpLeaf - vpAir) / 1000; // Convertendo para kPa
};

export const estimateLeafTemperature = (airTemp: number): number => {
  return airTemp - 2; // Estimativa simples: folha 2°C mais fria que o ar
};

export const getVPDZone = (vpd: number, stage: string): string => {
  const range = VPD_RANGES[stage as keyof typeof VPD_RANGES];
  if (vpd < range.min - 0.2) return 'tooLow';
  if (vpd < range.min) return 'low';
  if (vpd > range.max + 0.2) return 'tooHigh';
  if (vpd > range.max) return 'high';
  return 'optimal';
};

export const generateVPDRecommendations = (
  vpd: number,
  zone: string,
  temperature: number,
  humidity: number,
  stage: string
) => {
  const actions = [];
  let status = '';

  switch (zone) {
    case 'tooLow':
      status = 'VPD muito baixo - Risco de doenças';
      actions.push('Aumente a temperatura ou diminua a umidade');
      actions.push('Melhore a circulação de ar');
      actions.push('Verifique se há condensação nas folhas');
      break;
    case 'low':
      status = 'VPD baixo';
      actions.push('Considere aumentar a temperatura');
      actions.push('Monitore a umidade relativa');
      break;
    case 'optimal':
      status = 'VPD ótimo';
      actions.push('Mantenha as condições atuais');
      break;
    case 'high':
      status = 'VPD alto';
      actions.push('Considere diminuir a temperatura');
      actions.push('Aumente a umidade relativa');
      break;
    case 'tooHigh':
      status = 'VPD muito alto - Risco de estresse';
      actions.push('Diminua a temperatura imediatamente');
      actions.push('Aumente a umidade relativa');
      actions.push('Verifique a hidratação das plantas');
      break;
  }

  // Recomendações específicas por estágio
  if (stage === 'vegetativo') {
    actions.push('Mantenha boa circulação de ar');
    actions.push('Monitore o crescimento das folhas');
  } else if (stage === 'floracaoInicial') {
    actions.push('Ajuste gradualmente para VPD mais alto');
    actions.push('Monitore a formação de botões');
  } else if (stage === 'floracaoTardia') {
    actions.push('Mantenha VPD mais alto para produção de resina');
    actions.push('Evite flutuações bruscas');
  }

  return { status, actions };
};

export const generateChartData = (stage: string) => {
  const temperatures = Array.from({ length: 21 }, (_, i) => 15 + i);
  const humidities = [40, 50, 60, 70, 80];
  const range = VPD_RANGES[stage as keyof typeof VPD_RANGES];

  return {
    labels: temperatures.map(t => `${t}°C`),
    datasets: [
      ...humidities.map((h, i) => ({
        label: `${h}% UR`,
        data: temperatures.map(t => calculateVPD(estimateLeafTemperature(t), t, h)),
        borderColor: `hsl(${200 + i * 20}, 70%, 50%)`,
        tension: 0.1
      })),
      {
        label: 'VPD Mínimo',
        data: temperatures.map(() => range.min),
        borderColor: 'rgba(40, 167, 69, 0.5)',
        borderDash: [5, 5],
        fill: false
      },
      {
        label: 'VPD Máximo',
        data: temperatures.map(() => range.max),
        borderColor: 'rgba(40, 167, 69, 0.5)',
        borderDash: [5, 5],
        fill: false
      }
    ]
  };
};

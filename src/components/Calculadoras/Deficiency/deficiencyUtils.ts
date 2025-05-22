// Constantes para Deficiency Identifier
export const DEFICIENCY_TYPES = {
  nitrogen: {
    name: "Nitrogênio (N)",
    symptoms: [
      "Folhas inferiores amarelando",
      "Crescimento lento",
      "Plantas pálidas e pequenas"
    ],
    solutions: [
      "Adicione fertilizante rico em nitrogênio",
      "Verifique o pH do substrato (ideal: 6.0-6.5)",
      "Evite excesso de água que pode lixiviar o nitrogênio"
    ]
  },
  phosphorus: {
    name: "Fósforo (P)",
    symptoms: [
      "Folhas roxas/vermelhas",
      "Crescimento atrofiado",
      "Caules finos"
    ],
    solutions: [
      "Adicione fertilizante rico em fósforo",
      "Mantenha o pH entre 6.0-7.0 para melhor absorção",
      "Evite temperaturas muito baixas que dificultam a absorção"
    ]
  },
  potassium: {
    name: "Potássio (K)",
    symptoms: [
      "Bordas amareladas/marrons",
      "Pontos necróticos",
      "Caules fracos"
    ],
    solutions: [
      "Adicione fertilizante rico em potássio",
      "Verifique se não há excesso de cálcio ou magnésio",
      "Monitore a EC da solução nutritiva"
    ]
  },
  calcium: {
    name: "Cálcio (Ca)",
    symptoms: [
      "Pontos marrons nas folhas",
      "Folhas novas deformadas",
      "Pontas das folhas morrendo"
    ],
    solutions: [
      "Adicione suplemento de cálcio (CalMag)",
      "Verifique o pH (ideal: 6.2-6.5)",
      "Melhore a circulação de ar para aumentar a transpiração"
    ]
  },
  magnesium: {
    name: "Magnésio (Mg)",
    symptoms: [
      "Amarelamento entre nervuras",
      "Folhas mais velhas afetadas primeiro",
      "Nervuras permanecem verdes"
    ],
    solutions: [
      "Adicione suplemento de magnésio (CalMag ou Epsom)",
      "Verifique o pH (ideal: 6.0-6.5)",
      "Evite excesso de potássio que compete com o magnésio"
    ]
  }
};

export const DEFICIENCY_SYMPTOMS = {
  nitrogen: {
    symptoms: "Folhas inferiores amarelando, crescimento lento, plantas pálidas",
    solutions: [
      "Adicione fertilizante rico em nitrogênio",
      "Verifique o pH do substrato (ideal: 6.0-6.5)",
      "Evite excesso de água que pode lixiviar o nitrogênio"
    ]
  },
  phosphorus: {
    symptoms: "Folhas roxas/vermelhas, crescimento atrofiado, caules finos",
    solutions: [
      "Adicione fertilizante rico em fósforo",
      "Mantenha o pH entre 6.0-7.0 para melhor absorção",
      "Evite temperaturas muito baixas que dificultam a absorção"
    ]
  },
  potassium: {
    symptoms: "Bordas amareladas/marrons, pontos necróticos, caules fracos",
    solutions: [
      "Adicione fertilizante rico em potássio",
      "Verifique se não há excesso de cálcio ou magnésio",
      "Monitore a EC da solução nutritiva"
    ]
  },
  calcium: {
    symptoms: "Pontos marrons nas folhas, folhas novas deformadas, pontas morrendo",
    solutions: [
      "Adicione suplemento de cálcio (CalMag)",
      "Verifique o pH (ideal: 6.2-6.5)",
      "Melhore a circulação de ar para aumentar a transpiração"
    ]
  },
  magnesium: {
    symptoms: "Amarelamento entre nervuras, folhas mais velhas afetadas primeiro",
    solutions: [
      "Adicione suplemento de magnésio (CalMag ou Epsom)",
      "Verifique o pH (ideal: 6.0-6.5)",
      "Evite excesso de potássio que compete com o magnésio"
    ]
  }
};

export const calculateDeficiencyProbability = (
  symptoms: string[],
  phValue: number,
  ecValue: number,
  growthStage: string
): Record<string, number> => {
  const probabilities: Record<string, number> = {
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    calcium: 0,
    magnesium: 0
  };
  
  // Base probabilities from symptoms
  if (symptoms.includes("Folhas inferiores amarelando")) probabilities.nitrogen += 0.6;
  if (symptoms.includes("Crescimento lento")) probabilities.nitrogen += 0.3;
  
  if (symptoms.includes("Folhas roxas/vermelhas")) probabilities.phosphorus += 0.7;
  if (symptoms.includes("Crescimento atrofiado")) probabilities.phosphorus += 0.3;
  
  if (symptoms.includes("Bordas amareladas/marrons")) probabilities.potassium += 0.6;
  if (symptoms.includes("Pontos necróticos")) probabilities.potassium += 0.4;
  
  if (symptoms.includes("Pontos marrons nas folhas")) probabilities.calcium += 0.5;
  if (symptoms.includes("Folhas novas deformadas")) probabilities.calcium += 0.5;
  
  if (symptoms.includes("Amarelamento entre nervuras")) probabilities.magnesium += 0.7;
  
  // Adjust based on pH
  if (phValue < 5.5) {
    probabilities.calcium += 0.2;
    probabilities.magnesium += 0.2;
  } else if (phValue > 7.0) {
    probabilities.phosphorus += 0.2;
    probabilities.iron += 0.2;
  }
  
  // Adjust based on EC
  if (ecValue > 2.5) {
    // High EC can cause nutrient lockout
    Object.keys(probabilities).forEach(key => {
      probabilities[key] += 0.1;
    });
  }
  
  // Adjust based on growth stage
  if (growthStage === "vegetativo") {
    probabilities.nitrogen += 0.1;
  } else if (growthStage === "floracao") {
    probabilities.phosphorus += 0.1;
    probabilities.potassium += 0.1;
  }
  
  // Normalize to 0-1 range
  Object.keys(probabilities).forEach(key => {
    probabilities[key] = Math.min(probabilities[key], 1);
  });
  
  return probabilities;
};

export const generateDeficiencyChartData = (probabilities: Record<string, number>) => {
  return {
    labels: Object.keys(probabilities).map(key => 
      DEFICIENCY_TYPES[key as keyof typeof DEFICIENCY_TYPES]?.name || key
    ),
    datasets: [
      {
        label: 'Probabilidade',
        data: Object.values(probabilities),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }
    ]
  };
};

export const generateRecommendationSchedule = (
  deficiencies: Array<{ nutrient: string; symptoms: string; solutions: string[] }>,
  growthStage: string
) => {
  const schedule = [];
  
  // Imediato (Dia 1)
  const immediateActions = [];
  deficiencies.forEach(deficiency => {
    if (deficiency.solutions.length > 0) {
      immediateActions.push(deficiency.solutions[0]);
    }
  });
  
  if (immediateActions.length > 0) {
    schedule.push({
      day: 1,
      actions: immediateActions
    });
  }
  
  // Curto prazo (Dia 3-5)
  const shortTermActions = [];
  deficiencies.forEach(deficiency => {
    if (deficiency.solutions.length > 1) {
      shortTermActions.push(deficiency.solutions[1]);
    }
  });
  
  if (shortTermActions.length > 0) {
    schedule.push({
      day: 3,
      actions: shortTermActions
    });
  }
  
  // Médio prazo (Dia 7-10)
  const mediumTermActions = [];
  deficiencies.forEach(deficiency => {
    if (deficiency.solutions.length > 2) {
      mediumTermActions.push(deficiency.solutions[2]);
    }
  });
  
  // Adicionar recomendações gerais baseadas na fase
  if (growthStage === "vegetativo") {
    mediumTermActions.push("Considere aumentar a dose de fertilizante vegetativo");
  } else if (growthStage === "floracao") {
    mediumTermActions.push("Considere aumentar a dose de fertilizante de floração");
  }
  
  if (mediumTermActions.length > 0) {
    schedule.push({
      day: 7,
      actions: mediumTermActions
    });
  }
  
  return schedule;
};

export const identifyDeficiencies = (symptoms: string[]): Array<{ nutrient: string; symptoms: string; solutions: string[] }> => {
  const deficiencies = [];
  
  if (symptoms.includes("Folhas inferiores amarelando")) {
    deficiencies.push({
      nutrient: "nitrogen",
      ...DEFICIENCY_SYMPTOMS.nitrogen
    });
  }
  
  if (symptoms.includes("Folhas roxas/vermelhas")) {
    deficiencies.push({
      nutrient: "phosphorus",
      ...DEFICIENCY_SYMPTOMS.phosphorus
    });
  }
  
  if (symptoms.includes("Bordas amareladas/marrons")) {
    deficiencies.push({
      nutrient: "potassium",
      ...DEFICIENCY_SYMPTOMS.potassium
    });
  }
  
  if (symptoms.includes("Pontos marrons nas folhas")) {
    deficiencies.push({
      nutrient: "calcium",
      ...DEFICIENCY_SYMPTOMS.calcium
    });
  }
  
  if (symptoms.includes("Amarelamento entre nervuras")) {
    deficiencies.push({
      nutrient: "magnesium",
      ...DEFICIENCY_SYMPTOMS.magnesium
    });
  }
  
  return deficiencies;
};

// Constantes para Nutrients Calculator
export const NUTRIENT_DOSAGES = {
  mudas: {
    "Grow (Vegetativo)": { mlPerLiter: 1.0, ec: 0.2 },
    "Bloom (Floração)": { mlPerLiter: 0.5, ec: 0.1 },
    "Micro": { mlPerLiter: 0.5, ec: 0.1 },
    "CalMag": { mlPerLiter: 0.5, ec: 0.1 },
    "Silício": { mlPerLiter: 0.2, ec: 0.05 },
    "Enzimas": { mlPerLiter: 0.5, ec: 0.05 },
    "PK Booster": { mlPerLiter: 0, ec: 0 },
    "Estimulador de Raízes": { mlPerLiter: 0.5, ec: 0.05 },
    "Potenciador de Floração": { mlPerLiter: 0, ec: 0 }
  },
  vegetativo: {
    "Grow (Vegetativo)": { mlPerLiter: 2.0, ec: 0.4 },
    "Bloom (Floração)": { mlPerLiter: 0.5, ec: 0.1 },
    "Micro": { mlPerLiter: 1.0, ec: 0.2 },
    "CalMag": { mlPerLiter: 1.0, ec: 0.2 },
    "Silício": { mlPerLiter: 0.5, ec: 0.1 },
    "Enzimas": { mlPerLiter: 1.0, ec: 0.1 },
    "PK Booster": { mlPerLiter: 0, ec: 0 },
    "Estimulador de Raízes": { mlPerLiter: 0.5, ec: 0.05 },
    "Potenciador de Floração": { mlPerLiter: 0, ec: 0 }
  },
  preFloração: {
    "Grow (Vegetativo)": { mlPerLiter: 1.0, ec: 0.2 },
    "Bloom (Floração)": { mlPerLiter: 1.5, ec: 0.3 },
    "Micro": { mlPerLiter: 1.0, ec: 0.2 },
    "CalMag": { mlPerLiter: 1.0, ec: 0.2 },
    "Silício": { mlPerLiter: 0.5, ec: 0.1 },
    "Enzimas": { mlPerLiter: 1.0, ec: 0.1 },
    "PK Booster": { mlPerLiter: 0.5, ec: 0.1 },
    "Estimulador de Raízes": { mlPerLiter: 0, ec: 0 },
    "Potenciador de Floração": { mlPerLiter: 0.5, ec: 0.1 }
  },
  floração: {
    "Grow (Vegetativo)": { mlPerLiter: 0.5, ec: 0.1 },
    "Bloom (Floração)": { mlPerLiter: 2.0, ec: 0.4 },
    "Micro": { mlPerLiter: 1.0, ec: 0.2 },
    "CalMag": { mlPerLiter: 1.0, ec: 0.2 },
    "Silício": { mlPerLiter: 0.5, ec: 0.1 },
    "Enzimas": { mlPerLiter: 1.0, ec: 0.1 },
    "PK Booster": { mlPerLiter: 1.0, ec: 0.2 },
    "Estimulador de Raízes": { mlPerLiter: 0, ec: 0 },
    "Potenciador de Floração": { mlPerLiter: 1.0, ec: 0.2 }
  },
  flush: {
    "Grow (Vegetativo)": { mlPerLiter: 0, ec: 0 },
    "Bloom (Floração)": { mlPerLiter: 0, ec: 0 },
    "Micro": { mlPerLiter: 0, ec: 0 },
    "CalMag": { mlPerLiter: 0, ec: 0 },
    "Silício": { mlPerLiter: 0, ec: 0 },
    "Enzimas": { mlPerLiter: 0.5, ec: 0.05 },
    "PK Booster": { mlPerLiter: 0, ec: 0 },
    "Estimulador de Raízes": { mlPerLiter: 0, ec: 0 },
    "Potenciador de Floração": { mlPerLiter: 0, ec: 0 }
  }
};

export const DEFICIENCY_SYMPTOMS = {
  nitrogen: {
    symptoms: "Folhas inferiores amarelando, crescimento lento",
    solutions: [
      "Aumentar a dose de Grow",
      "Verificar pH do substrato",
      "Adicionar nitrogênio orgânico se necessário"
    ]
  },
  phosphorus: {
    symptoms: "Folhas roxas/vermelhas, crescimento atrofiado",
    solutions: [
      "Aumentar a dose de Bloom",
      "Adicionar PK Booster",
      "Verificar temperatura do substrato"
    ]
  },
  potassium: {
    symptoms: "Bordas amareladas/marrons, folhas queimadas",
    solutions: [
      "Aumentar a dose de Bloom",
      "Adicionar PK Booster",
      "Verificar pH do substrato"
    ]
  },
  calcium: {
    symptoms: "Pontos marrons nas folhas, crescimento deformado",
    solutions: [
      "Adicionar CalMag",
      "Verificar pH do substrato",
      "Ajustar dureza da água"
    ]
  },
  magnesium: {
    symptoms: "Amarelamento entre nervuras, folhas retorcidas",
    solutions: [
      "Adicionar CalMag",
      "Verificar pH do substrato",
      "Ajustar dureza da água"
    ]
  }
};

// Funções auxiliares para Nutrients Calculator
export const convertECPPM = (value: number, fromUnit: 'ec' | 'ppm500' | 'ppm700', toUnit: 'ec' | 'ppm500' | 'ppm700'): number => {
  if (fromUnit === toUnit) return value;
  
  const conversions = {
    'ec': { 'ppm500': 500, 'ppm700': 700 },
    'ppm500': { 'ec': 1/500, 'ppm700': 700/500 },
    'ppm700': { 'ec': 1/700, 'ppm500': 500/700 }
  } as const;
  
  return value * (conversions[fromUnit][toUnit] || 1);
};

export const calculateNutrients = (
  phase: string,
  substrate: string,
  waterVolume: number,
  waterEC: number,
  waterHardness: string,
  selectedNutrients: Record<string, boolean>
) => {
  const dosages: Record<string, { mlPerLiter: number; mlTotal: number }> = {};
  let totalEC = waterEC;
  
  // Ajustar EC base na dureza da água
  const hardnessFactors = {
    soft: 1.2,
    medium: 1.0,
    hard: 0.8
  };
  
  const hardnessFactor = hardnessFactors[waterHardness as keyof typeof hardnessFactors] || 1.0;
  
  // Calcular dosagens para cada nutriente selecionado
  Object.entries(selectedNutrients).forEach(([nutrient, isSelected]) => {
    if (isSelected && NUTRIENT_DOSAGES[phase as keyof typeof NUTRIENT_DOSAGES][nutrient]) {
      const dosage = NUTRIENT_DOSAGES[phase as keyof typeof NUTRIENT_DOSAGES][nutrient];
      const adjustedMlPerLiter = dosage.mlPerLiter * hardnessFactor;
      
      dosages[nutrient] = {
        mlPerLiter: adjustedMlPerLiter,
        mlTotal: adjustedMlPerLiter * waterVolume
      };
      
      totalEC += dosage.ec * hardnessFactor;
    }
  });
  
  // Ajustar EC final baseado no substrato
  const substrateFactors = {
    solo: 0.8,
    coco: 1.0,
    hidroponia: 1.2
  };
  
  const substrateFactor = substrateFactors[substrate as keyof typeof substrateFactors] || 1.0;
  totalEC *= substrateFactor;
  
  return {
    dosages,
    targetEC: getTargetEC(phase, substrate),
    resultEC: totalEC
  };
};

export const checkIncompatibilities = (selectedNutrients: Record<string, boolean>) => {
  const incompatibilities = [];
  
  if (selectedNutrients["CalMag"] && selectedNutrients["Silício"]) {
    incompatibilities.push("CalMag e Silício podem precipitar quando misturados. Adicione separadamente.");
  }
  
  if (selectedNutrients["PK Booster"] && selectedNutrients["CalMag"]) {
    incompatibilities.push("PK Booster e CalMag podem reagir. Adicione com intervalo de algumas horas.");
  }
  
  return incompatibilities;
};

export const generateFeedingSchedule = (
  phase: string,
  dosages: Record<string, { mlPerLiter: number; mlTotal: number }>
) => {
  const weeklyFactors = {
    mudas: {
      week1: 0.5,
      week2: 0.75,
      week3: 1.0
    },
    vegetativo: {
      week1: 0.5,
      week2: 0.75,
      week3: 1.0,
      week4: 1.0
    },
    preFloração: {
      week1: 0.75,
      week2: 1.0
    },
    floração: {
      week1: 0.75,
      week2: 1.0,
      week3: 1.0,
      week4: 1.0,
      week5: 0.75,
      week6: 0.5
    },
    flush: {
      week1: 1.0,
      week2: 0.5
    }
  };
  
  return weeklyFactors[phase as keyof typeof weeklyFactors] || weeklyFactors.vegetativo;
};

export const generateNutrientLevelsData = (dosages: Record<string, { mlPerLiter: number; mlTotal: number }>, phase: string) => {
  const baseLevels = {
    mudas: [2, 1, 1, 1, 1, 1],
    vegetativo: [3, 1, 2, 2, 1, 1],
    preFloração: [2, 2, 3, 2, 1, 1],
    floração: [1, 3, 4, 2, 1, 1],
    flush: [0, 0, 0, 0, 0, 0]
  };
  
  const currentLevels = baseLevels[phase as keyof typeof baseLevels] || baseLevels.vegetativo;
  
  return {
    labels: ['Nitrogênio (N)', 'Fósforo (P)', 'Potássio (K)', 'Cálcio (Ca)', 'Magnésio (Mg)', 'Micronutrientes'],
    datasets: [
      {
        label: 'Nível Atual',
        data: currentLevels,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      },
      {
        label: 'Nível Ideal',
        data: baseLevels.vegetativo,
        backgroundColor: 'rgba(255, 206, 86, 0.5)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1
      }
    ]
  };
};

export const getTargetEC = (phase: string, substrate: string): number => {
  const baseEC = {
    mudas: 0.8,
    vegetativo: 1.4,
    preFloração: 1.8,
    floração: 2.0,
    flush: 0.2
  };
  
  const substrateFactors = {
    solo: 0.8,
    coco: 1.0,
    hidroponia: 1.2
  };
  
  const baseValue = baseEC[phase as keyof typeof baseEC] || baseEC.vegetativo;
  const factor = substrateFactors[substrate as keyof typeof substrateFactors] || 1.0;
  
  return baseValue * factor;
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

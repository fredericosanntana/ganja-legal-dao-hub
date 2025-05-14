
export interface Symptom {
  id: string;
  label: string;
  deficiencies: string[];
}

export interface DeficiencyInfo {
  description: string;
  solutions: string[];
  causes?: string[];
  severity?: 'low' | 'medium' | 'high';
}

export const symptoms: Symptom[] = [
  {
    id: "symptom-yellow-lower",
    label: "Folhas inferiores amarelando",
    deficiencies: ["Nitrogênio", "Mobilidade de nutrientes"]
  },
  {
    id: "symptom-purple",
    label: "Folhas roxas/vermelhas",
    deficiencies: ["Fósforo", "Temperatura baixa"]
  },
  {
    id: "symptom-edges",
    label: "Bordas amareladas/marrons",
    deficiencies: ["Potássio", "Queimadura por nutrientes"]
  },
  {
    id: "symptom-brown-spots",
    label: "Pontos marrons nas folhas",
    deficiencies: ["Cálcio", "Manganês", "Fungos"]
  },
  {
    id: "symptom-veins",
    label: "Amarelamento entre nervuras",
    deficiencies: ["Magnésio", "Ferro", "Zinco"]
  },
  {
    id: "symptom-twisted",
    label: "Folhas retorcidas",
    deficiencies: ["Cálcio", "pH desbalanceado", "Pragas"]
  }
];

export const deficienciesDatabase: Record<string, DeficiencyInfo> = {
  "Nitrogênio": {
    description: "Deficiência de Nitrogênio - elemento essencial para o crescimento vegetativo.",
    solutions: ["Adicione fertilizante rico em N", "Verifique se o pH está entre 5.8-6.2"],
    severity: "medium"
  },
  "Fósforo": {
    description: "Deficiência de Fósforo - importante para desenvolvimento de raízes e floração.",
    solutions: ["Adicione fertilizante rico em P", "Mantenha temperatura adequada do substrato"],
    severity: "medium"
  },
  "Potássio": {
    description: "Deficiência de Potássio - crucial para a saúde geral e resistência.",
    solutions: ["Adicione fertilizante rico em K", "Verifique a drenagem do substrato"],
    severity: "medium"
  },
  "Cálcio": {
    description: "Deficiência de Cálcio - necessário para paredes celulares fortes.",
    solutions: ["Use Cal-Mag", "Verifique se o pH não está muito baixo"],
    severity: "high"
  },
  "Magnésio": {
    description: "Deficiência de Magnésio - componente central da clorofila.",
    solutions: ["Use Cal-Mag ou Epsom Salt", "Verifique equilíbrio com outros nutrientes"],
    severity: "medium"
  },
  "Ferro": {
    description: "Deficiência de Ferro - essencial para a produção de clorofila.",
    solutions: ["Adicione quelato de ferro", "Verifique se o pH não está muito alto"],
    severity: "medium"
  },
  "Zinco": {
    description: "Deficiência de Zinco - necessário para crescimento e desenvolvimento.",
    solutions: ["Use micronutrientes balanceados", "Verifique se há excesso de P"],
    severity: "low"
  },
  "Manganês": {
    description: "Deficiência de Manganês - importante para processos metabólicos.",
    solutions: ["Adicione micronutrientes", "Verifique se o pH não está muito alto"],
    severity: "low"
  },
  "pH desbalanceado": {
    description: "pH fora da faixa ideal impede absorção de nutrientes.",
    solutions: ["Ajuste pH para 5.8-6.2 em cultivos sem solo", "6.0-6.5 para solo"],
    severity: "high"
  },
  "Mobilidade de nutrientes": {
    description: "Problemas na translocação de nutrientes dentro da planta.",
    solutions: ["Verifique condições de raiz", "Ajuste regime de irrigação"],
    severity: "medium"
  },
  "Queimadura por nutrientes": {
    description: "Excesso de nutrientes/fertilizantes causando toxicidade.",
    solutions: ["Reduza concentração de nutrientes", "Lave o substrato com água pura"],
    severity: "high"
  },
  "Temperatura baixa": {
    description: "Temperaturas abaixo do ideal afetam absorção de nutrientes.",
    solutions: ["Mantenha temperatura ambiente entre 20-28°C", "Isole área de cultivo"],
    severity: "medium"
  },
  "Pragas": {
    description: "Insetos ou ácaros podem causar danos às folhas.",
    solutions: ["Inspecione parte inferior das folhas", "Use tratamentos adequados para pragas"],
    severity: "high"
  },
  "Fungos": {
    description: "Infecções fúngicas podem causar manchas nas folhas.",
    solutions: ["Melhore circulação de ar", "Reduza umidade", "Use fungicida se necessário"],
    severity: "high"
  }
};

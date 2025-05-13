
import { Votacao, Proposta, Voto } from "../types/votacoes";

// Mock data for demonstrations
const mockVotacoes: Votacao[] = [
  {
    id: "1",
    titulo: "Prioridades Legislativas 2025",
    descricao: "Quais projetos de lei devem ser priorizados nas ações de advocacy da GanjaDAO no próximo ano?",
    dataInicio: new Date('2025-01-01'),
    dataFim: new Date('2025-01-15'),
    status: 'ativa',
    propostas: [
      {
        id: "1-1",
        titulo: "PL 399/2015 - Medicinal",
        descricao: "Focar no PL que regulamenta o cultivo de Cannabis para fins medicinais",
        creditosAlocados: 45,
        votos: 12
      },
      {
        id: "1-2",
        titulo: "PL 733/2019 - Descriminalização",
        descricao: "Focar nos projetos que propõem a descriminalização do cultivo para uso pessoal",
        creditosAlocados: 35,
        votos: 8
      },
      {
        id: "1-3",
        titulo: "PL 514/2017 - Cânhamo Industrial",
        descricao: "Priorizar o projeto que regulamenta o cultivo de cânhamo para fins industriais",
        creditosAlocados: 20,
        votos: 5
      }
    ]
  },
  {
    id: "2",
    titulo: "Próximo Festival GanjaDAO",
    descricao: "Onde devemos realizar nosso próximo festival comunitário?",
    dataInicio: new Date('2025-02-01'),
    dataFim: new Date('2025-02-10'),
    status: 'pendente',
    propostas: [
      {
        id: "2-1",
        titulo: "São Paulo",
        descricao: "Realizar o evento na capital paulista",
        creditosAlocados: 30,
        votos: 10
      },
      {
        id: "2-2",
        titulo: "Rio de Janeiro",
        descricao: "Realizar o evento na capital fluminense",
        creditosAlocados: 25,
        votos: 8
      },
      {
        id: "2-3",
        titulo: "Belo Horizonte",
        descricao: "Realizar o evento na capital mineira",
        creditosAlocados: 15,
        votos: 5
      }
    ]
  },
  {
    id: "3",
    titulo: "Investimentos em Pesquisa",
    descricao: "Em qual área de pesquisa sobre Cannabis a GanjaDAO deve investir no próximo ciclo?",
    dataInicio: new Date('2024-12-01'),
    dataFim: new Date('2024-12-15'),
    status: 'finalizada',
    propostas: [
      {
        id: "3-1",
        titulo: "Aplicações Medicinais",
        descricao: "Pesquisas sobre novas aplicações medicinais da Cannabis",
        creditosAlocados: 60,
        votos: 25
      },
      {
        id: "3-2",
        titulo: "Tecnologias de Cultivo",
        descricao: "Desenvolvimento de métodos mais sustentáveis e eficientes de cultivo",
        creditosAlocados: 40,
        votos: 15
      },
      {
        id: "3-3",
        titulo: "Impactos Socioeconômicos",
        descricao: "Estudos sobre os impactos da legalização na economia e sociedade",
        creditosAlocados: 20,
        votos: 8
      }
    ]
  }
];

export const getVotacoes = async (): Promise<Votacao[]> => {
  // Simulação de uma chamada API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVotacoes), 500);
  });
};

export const getVotacao = async (id: string): Promise<Votacao | undefined> => {
  // Simulação de uma chamada API
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockVotacoes.find(v => v.id === id)), 500);
  });
};

export const votar = async (votacaoId: string, propostaId: string, creditos: number): Promise<boolean> => {
  // Simulação de uma chamada API para registrar voto
  console.log(`Votou na proposta ${propostaId} da votação ${votacaoId} com ${creditos} créditos`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(true), 500);
  });
};

// Função para calcular raiz quadrada (votação quadrática)
export const calcularCustoQuadratico = (creditos: number): number => {
  return Math.pow(creditos, 2);
};

// Função para calcular poder de voto com base em créditos
export const calcularPoderDeVoto = (creditos: number): number => {
  return Math.sqrt(creditos);
};

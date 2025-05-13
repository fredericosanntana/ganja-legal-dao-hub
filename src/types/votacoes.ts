
export interface Voto {
  id: string;
  userId: string;
  proposta: string;
  creditos: number;
  timestamp: Date;
}

export interface Proposta {
  id: string;
  titulo: string;
  descricao: string;
  creditosAlocados: number;
  votos: number;
}

export interface Votacao {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: Date;
  dataFim: Date;
  status: 'ativa' | 'finalizada' | 'pendente';
  propostas: Proposta[];
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  creditosDisponíveis: number;
  membro: boolean;
}

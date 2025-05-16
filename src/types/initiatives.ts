
export type InitiativeStatus = 'open' | 'closed' | 'canceled';

export interface Initiative {
  id: string;
  title: string;
  description: string;
  status: InitiativeStatus;
  created_at: string;
  updated_at: string;
  user_id: string;
  author?: {
    id: string;
    username: string;
  };
  votes: InitiativeVote[];
  _count?: {
    votes: number;
  };
}

export interface InitiativeVote {
  id: string;
  user_id: string;
  initiative_id: string;
  credits_spent: number;
  created_at: string;
  updated_at: string;
}

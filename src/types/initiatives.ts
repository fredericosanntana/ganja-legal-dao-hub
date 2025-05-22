
export type InitiativeStatus = 'open' | 'closed' | 'canceled' | 'approved' | 'rejected' | 'implementing' | 'completed';

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
    avatar_url?: string;
  };
  creator?: {
    id: string;
    username: string;
    avatar_url?: string;
  };
  votes: InitiativeVote[];
  total_votes?: number;
  unique_voters?: number;
  _count?: {
    votes: number;
  };
}

export interface InitiativeVote {
  id: string;
  user_id: string;
  initiative_id: string;
  credits_spent: number;
  intensity?: number;
  created_at: string;
  updated_at: string;
}

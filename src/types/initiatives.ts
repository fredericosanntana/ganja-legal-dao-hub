
export type InitiativeStatus = 'open' | 'closed' | 'canceled';

export interface Initiative {
  id: string;
  title: string;
  description: string;
  user_id: string;
  status: InitiativeStatus;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string;
  };
  votes: {
    id: string;
    user_id: string;
    initiative_id: string;
    credits_spent: number;
    created_at: string;
    updated_at: string;
  }[];
}

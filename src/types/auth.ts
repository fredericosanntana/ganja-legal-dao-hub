
export interface User {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  votes: Vote[];
  vote_credits: {
    total_credits: number;
    last_reset_at?: string;
  };
  subscription?: {
    status: string;
    plan: string;
    current_period_end: string;
    expires_at?: string;
  };
}

export interface Vote {
  id: string;
  user_id: string;
  initiative_id: string;
  credits_spent: number;
  created_at: string;
  updated_at: string;
  initiative?: {
    id: string;
    title: string;
  };
}

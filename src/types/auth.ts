
export interface User {
  id: string;
  email: string;
  username: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  votes: any[];
  vote_credits: number;
  subscription?: {
    status: string;
    plan: string;
    current_period_end: string;
  };
}

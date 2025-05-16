
export interface User {
  id: string;  // Changed to string (UUID) to match Supabase
  username: string;
  email: string;
  password?: string;  // Optional because we don't want to expose it in most cases
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  subscription?: Subscription;
  vote_credits?: UserVoteCredit;
  votes: Vote[];
}

export interface Subscription {
  id: string;  // Changed to string (UUID) to match Supabase
  user_id: string;  // Changed to string (UUID) to match Supabase
  status: string;
  started_at: string;
  expires_at?: string;
  canceled_at?: string;
  payment_details?: string;
  created_at: string;
  updated_at: string;
}

export interface UserVoteCredit {
  id: string;  // Changed to string (UUID) to match Supabase
  user_id: string;  // Changed to string (UUID) to match Supabase
  total_credits: number;
  last_reset_at?: string;
  updated_at: string;
}

export interface Vote {
  id: string;
  user_id: string;  // Changed to string (UUID) to match Supabase
  initiative_id: string;
  credits_spent: number;
  created_at: string;
  updated_at: string;
  initiative?: {
    id: string;
    title: string;
  };
}

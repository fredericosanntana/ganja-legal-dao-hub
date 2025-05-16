
export interface User {
  id: string;  
  username: string;
  email: string;
  password?: string;  
  is_admin: boolean;
  created_at: string;
  updated_at: string;
  subscription?: Subscription;
  vote_credits?: UserVoteCredit;
  votes: Vote[];
}

export interface Subscription {
  id: string;  
  user_id: string;  
  status: string;
  started_at: string;
  expires_at?: string;
  canceled_at?: string;
  payment_details?: string;
  created_at: string;
  updated_at: string;
}

export interface UserVoteCredit {
  id: string;  
  user_id: string;  
  total_credits: number;
  last_reset_at?: string;
  updated_at: string;
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

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

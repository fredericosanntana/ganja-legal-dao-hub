
export interface Initiative {
  id: string;
  title: string;
  description: string;
  user_id: string;  // Changed to string (UUID) to match Supabase
  status: "open" | "closed" | "canceled";
  created_at: string;
  updated_at: string;
  votes: Vote[];
  author?: {
    id: string;  // Changed to string (UUID) to match Supabase
    username: string;
  };
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

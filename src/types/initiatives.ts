
export interface Initiative {
  id: string;
  title: string;
  description: string;
  user_id: number;
  status: "open" | "closed" | "canceled";
  created_at: string;
  updated_at: string;
  votes: Vote[];
  author?: {
    id: number;
    username: string;
  };
}

export interface Vote {
  id: string;
  user_id: number;
  initiative_id: string;
  credits_spent: number;
  created_at: string;
  updated_at: string;
  initiative?: {
    id: string;
    title: string;
  };
}

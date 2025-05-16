import { User } from "./auth";

export interface Post {
  id: string;  // Changed to string (UUID) to match Supabase
  title: string;
  content: string;
  user_id: string;  // Changed to string (UUID) to match Supabase
  category?: string;
  created_at: string;
  updated_at: string;
  author?: User;
  comments?: Comment[];
  likes?: PostLike[];
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface Comment {
  id: string;  // Changed to string (UUID) to match Supabase
  content: string;
  user_id: string;  // Changed to string (UUID) to match Supabase
  post_id: string;  // Changed to string (UUID) to match Supabase
  parent_id?: string;  // Changed to string (UUID) to match Supabase
  created_at: string;
  updated_at: string;
  author?: User;
  replies?: Comment[];
  likes?: CommentLike[];
  _count?: {
    replies: number;
    likes: number;
  };
}

export interface PostLike {
  id: string;  // Changed to string (UUID) to match Supabase
  user_id: string;  // Changed to string (UUID) to match Supabase
  post_id: string;  // Changed to string (UUID) to match Supabase
  created_at: string;
}

export interface CommentLike {
  id: string;  // Changed to string (UUID) to match Supabase
  user_id: string;  // Changed to string (UUID) to match Supabase
  comment_id: string;  // Changed to string (UUID) to match Supabase
  created_at: string;
}

export type PostCategory = "geral" | "jurídico" | "política" | "cultivo" | "medicinal" | "outros";

export const POST_CATEGORIES: {label: string, value: PostCategory}[] = [
  { label: "Geral", value: "geral" },
  { label: "Jurídico", value: "jurídico" },
  { label: "Política", value: "política" },
  { label: "Cultivo", value: "cultivo" },
  { label: "Medicinal", value: "medicinal" },
  { label: "Outros", value: "outros" }
];

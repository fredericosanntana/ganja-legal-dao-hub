
import { User } from "./auth";

export interface Post {
  id: number;
  title: string;
  content: string;
  user_id: number;
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
  id: number;
  content: string;
  user_id: number;
  post_id: number;
  parent_id?: number;
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
  id: number;
  user_id: number;
  post_id: number;
  created_at: string;
}

export interface CommentLike {
  id: number;
  user_id: number;
  comment_id: number;
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

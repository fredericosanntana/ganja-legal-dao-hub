
import { User } from "./auth";

export interface Post {
  id: string;
  title: string;
  content: string;
  user_id: string;
  category?: string;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string;
  };
  comments?: Comment[];
  likes?: PostLike[];
  _count?: {
    comments: number;
    likes: number;
  };
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  parent_id?: string | null;
  created_at: string;
  updated_at: string;
  author?: {
    id: string;
    username: string;
  };
  likes?: CommentLike[];
  replies?: Comment[];
  _count?: {
    likes: number;
    replies?: number;
  };
}

export interface PostLike {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}

export interface CommentLike {
  id: string;
  user_id: string;
  comment_id: string;
  created_at: string;
}

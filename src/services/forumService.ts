
import { Post, Comment } from '@/types/forum';

// Base API URL
const API_URL = '/api';

// Posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    const response = await fetch(`${API_URL}/posts`);
    if (!response.ok) {
      throw new Error('Falha ao carregar posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const getPostById = async (id: number | string): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`);
    if (!response.ok) {
      throw new Error('Falha ao carregar post');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error);
    throw error;
  }
};

export const createPost = async (postData: Partial<Post>): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao criar post');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

export const updatePost = async (id: number, postData: Partial<Post>): Promise<Post> => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao atualizar post');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating post ${id}:`, error);
    throw error;
  }
};

export const deletePost = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao deletar post');
    }
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error);
    throw error;
  }
};

export const likePost = async (postId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao curtir post');
    }
  } catch (error) {
    console.error(`Error liking post ${postId}:`, error);
    throw error;
  }
};

export const unlikePost = async (postId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/unlike`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao descurtir post');
    }
  } catch (error) {
    console.error(`Error unliking post ${postId}:`, error);
    throw error;
  }
};

// Comments
export const getCommentsByPostId = async (postId: number): Promise<Comment[]> => {
  try {
    const response = await fetch(`${API_URL}/posts/${postId}/comments`);
    if (!response.ok) {
      throw new Error('Falha ao carregar comentários');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

export const createComment = async (commentData: Partial<Comment>): Promise<Comment> => {
  try {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao criar comentário');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (id: number, commentData: Partial<Comment>): Promise<Comment> => {
  try {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao atualizar comentário');
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error updating comment ${id}:`, error);
    throw error;
  }
};

export const deleteComment = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/comments/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao deletar comentário');
    }
  } catch (error) {
    console.error(`Error deleting comment ${id}:`, error);
    throw error;
  }
};

export const likeComment = async (commentId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/comments/${commentId}/like`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao curtir comentário');
    }
  } catch (error) {
    console.error(`Error liking comment ${commentId}:`, error);
    throw error;
  }
};

export const unlikeComment = async (commentId: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/comments/${commentId}/unlike`, {
      method: 'POST',
      credentials: 'include',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Falha ao descurtir comentário');
    }
  } catch (error) {
    console.error(`Error unliking comment ${commentId}:`, error);
    throw error;
  }
};

// Mock data for development
export const mockPosts: Post[] = [
  {
    id: 1,
    title: "Bem-vindos à Comunidade GanjaDAO",
    content: "Esta é a nova comunidade para membros discutirem temas relevantes para a causa canábica no Brasil.",
    user_id: 1,
    category: "geral",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: {
      id: 1,
      username: "admin",
      email: "admin@ganjadao.com",
      is_admin: true
    },
    _count: {
      comments: 2,
      likes: 5
    }
  },
  {
    id: 2,
    title: "Novidades sobre a tramitação no Senado",
    content: "Discussão sobre os últimos acontecimentos na tramitação da regulamentação da Cannabis no Senado Federal.",
    user_id: 2,
    category: "política",
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: 2,
      username: "maria_silva",
      email: "maria@example.com",
      is_admin: false
    },
    _count: {
      comments: 8,
      likes: 12
    }
  },
  {
    id: 3,
    title: "Dicas de cultivo para iniciantes",
    content: "Compartilhando algumas dicas básicas para quem está começando no autocultivo terapêutico.",
    user_id: 3,
    category: "cultivo",
    created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 172800000).toISOString(),
    author: {
      id: 3,
      username: "joao_santos",
      email: "joao@example.com",
      is_admin: false
    },
    _count: {
      comments: 15,
      likes: 20
    }
  }
];

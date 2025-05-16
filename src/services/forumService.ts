
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Post, Comment, PostLike } from '@/types/forum';

// Get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  return getPosts();
};

// Get all posts - implementation
export const getPosts = async (): Promise<Post[]> => {
  // Using mock data for now
  const useMockData = true;
  
  if (useMockData) {
    // Return mock posts - ensure each post has properly formatted _count
    return mockPosts.map(post => ({
      ...post,
      _count: { comments: post.comments?.length || 0, likes: post.likes?.length || 0 }
    }));
  }

  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:user_id(id, username),
        comments(count),
        likes(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      toast.error('Falha ao carregar posts');
      return [];
    }

    // Transform the data to match our Post type
    return data.map((post: any) => ({
      ...post,
      _count: { 
        comments: post._count?.comments || 0,
        likes: post._count?.likes || 0
      }
    })) as Post[];
  } catch (error) {
    console.error('Exception fetching posts:', error);
    toast.error('Erro inesperado ao carregar posts');
    return [];
  }
};

// Get a single post with comments
export const getPostById = async (postId: string): Promise<Post | null> => {
  try {
    // Get the post with author
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`
        *,
        author:user_id(id, username),
        comments(
          *,
          author:user_id(id, username),
          likes(count),
          replies:comments(
            *,
            author:user_id(id, username)
          )
        ),
        likes(*)
      `)
      .eq('id', postId)
      .single();

    if (postError) {
      console.error('Error fetching post:', postError);
      toast.error('Falha ao carregar o post');
      return null;
    }

    // Format the post data
    const formattedPost: Post = {
      id: post.id,
      title: post.title,
      content: post.content,
      user_id: post.user_id,
      category: post.category,
      created_at: post.created_at,
      updated_at: post.updated_at,
      author: post.author,
      comments: post.comments?.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        user_id: comment.user_id,
        post_id: comment.post_id,
        parent_id: comment.parent_id,
        created_at: comment.created_at,
        updated_at: comment.updated_at,
        author: comment.author,
        _count: {
          likes: comment.likes?.length || 0
        },
        replies: comment.replies?.map((reply: any) => ({
          id: reply.id,
          content: reply.content,
          user_id: reply.user_id,
          post_id: reply.post_id,
          parent_id: reply.parent_id,
          created_at: reply.created_at,
          updated_at: reply.updated_at,
          author: reply.author
        }))
      })) || [],
      likes: post.likes || [],
      _count: {
        comments: post.comments?.length || 0,
        likes: post.likes?.length || 0
      }
    };

    return formattedPost;
  } catch (error) {
    console.error('Exception fetching post:', error);
    toast.error('Erro inesperado ao carregar o post');
    return null;
  }
};

// Create a post
export const createPost = async (data: {
  title: string;
  content: string;
  user_id: string;
  category?: string;
}): Promise<Post | null> => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .insert({
        title: data.title,
        content: data.content,
        user_id: data.user_id,
        category: data.category
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      toast.error('Falha ao criar post');
      throw error;
    }

    toast.success('Post criado com sucesso!');
    return post;
  } catch (error) {
    console.error('Exception creating post:', error);
    throw error;
  }
};

// Create a comment
export const createComment = async (data: {
  content: string;
  user_id: string;
  post_id: string;
  parent_id?: string | null;
}): Promise<Comment | null> => {
  try {
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        content: data.content,
        user_id: data.user_id,
        post_id: data.post_id,
        parent_id: data.parent_id
      })
      .select(`
        *,
        author:user_id(id, username)
      `)
      .single();

    if (error) {
      console.error('Error creating comment:', error);
      toast.error('Falha ao criar comentário');
      throw error;
    }

    toast.success('Comentário adicionado com sucesso!');
    return comment as Comment;
  } catch (error) {
    console.error('Exception creating comment:', error);
    throw error;
  }
};

// Like post
export const likePost = async (postId: string): Promise<{ success: boolean }> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      toast.error('Você precisa estar logado para curtir posts');
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('post_likes')
      .insert({
        post_id: postId,
        user_id: user.user.id
      });

    if (error) {
      if (error.code === '23505') {
        // Duplicate key value violates unique constraint
        toast.error('Você já curtiu este post');
      } else {
        console.error('Error liking post:', error);
        toast.error('Falha ao curtir post');
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Exception liking post:', error);
    throw error;
  }
};

// Unlike post
export const unlikePost = async (postId: string): Promise<{ success: boolean }> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      toast.error('Você precisa estar logado para descurtir posts');
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error unliking post:', error);
      toast.error('Falha ao descurtir post');
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Exception unliking post:', error);
    throw error;
  }
};

// Delete comment
export const deleteComment = async (commentId: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (error) {
      console.error('Error deleting comment:', error);
      toast.error('Falha ao excluir comentário');
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Exception deleting comment:', error);
    throw error;
  }
};

// Like comment
export const likeComment = async (commentId: string): Promise<{ success: boolean }> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      toast.error('Você precisa estar logado para curtir comentários');
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('comment_likes')
      .insert({
        comment_id: commentId,
        user_id: user.user.id
      });

    if (error) {
      if (error.code === '23505') {
        // Duplicate key value violates unique constraint
        toast.error('Você já curtiu este comentário');
      } else {
        console.error('Error liking comment:', error);
        toast.error('Falha ao curtir comentário');
      }
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Exception liking comment:', error);
    throw error;
  }
};

// Unlike comment
export const unlikeComment = async (commentId: string): Promise<{ success: boolean }> => {
  try {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user?.user) {
      toast.error('Você precisa estar logado para descurtir comentários');
      throw new Error('User not authenticated');
    }

    const { error } = await supabase
      .from('comment_likes')
      .delete()
      .eq('comment_id', commentId)
      .eq('user_id', user.user.id);

    if (error) {
      console.error('Error unliking comment:', error);
      toast.error('Falha ao descurtir comentário');
      throw error;
    }

    return { success: true };
  } catch (error) {
    console.error('Exception unliking comment:', error);
    throw error;
  }
};

// Update post
export const updatePost = async (postId: string, data: {
  title: string;
  content: string;
  category?: string;
}): Promise<Post | null> => {
  try {
    const { data: post, error } = await supabase
      .from('posts')
      .update({
        title: data.title,
        content: data.content,
        category: data.category
      })
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      toast.error('Falha ao atualizar post');
      throw error;
    }

    toast.success('Post atualizado com sucesso!');
    return post as Post;
  } catch (error) {
    console.error('Exception updating post:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId: string): Promise<{ success: boolean }> => {
  try {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      toast.error('Falha ao excluir post');
      throw error;
    }

    toast.success('Post excluído com sucesso!');
    return { success: true };
  } catch (error) {
    console.error('Exception deleting post:', error);
    throw error;
  }
};

// Mock data for development
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Novo estudo sobre cannabis medicinal',
    content: 'Lorem ipsum dolor sit amet...',
    user_id: '1',
    category: 'Medicinal',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: {
      id: '1',
      username: 'drmedicinal'
    },
    _count: {
      comments: 5,
      likes: 12
    }
  },
  {
    id: '2',
    title: 'Discussão sobre legislação',
    content: 'Atualmente no Brasil...',
    user_id: '2',
    category: 'Legal',
    created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: '2',
      username: 'advogado420'
    },
    _count: {
      comments: 8,
      likes: 7
    }
  }
];

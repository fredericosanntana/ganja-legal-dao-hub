import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type Post = {
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
  _count?: {
    comments: number;
    likes: number;
  };
  comments?: Comment[];
  likes?: Like[];
};

export type Comment = {
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
  replies?: Comment[];
  _count?: {
    likes: number;
  };
  likes?: Like[];
};

export type Like = {
  id: string;
  user_id: string;
  post_id?: string;
  comment_id?: string;
  created_at: string;
};

// Get all posts
export const getPosts = async (): Promise<Post[]> => {
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
    const posts: Post[] = data.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      user_id: post.user_id,
      category: post.category,
      created_at: post.created_at,
      updated_at: post.updated_at,
      author: post.author,
      _count: {
        comments: post.comments?.length || 0,
        likes: post.likes?.length || 0
      }
    }));

    return posts;
  } catch (error) {
    console.error('Exception fetching posts:', error);
    toast.error('Erro inesperado ao carregar posts');
    return [];
  }
};

// Get a single post with comments
export const getPost = async (postId: string): Promise<Post | null> => {
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
      comments: post.comments?.map(comment => ({
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
        replies: comment.replies?.map(reply => ({
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
      likes: post.likes,
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
}) => {
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
}) => {
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
    return comment;
  } catch (error) {
    console.error('Exception creating comment:', error);
    throw error;
  }
};

// Toggle like on post
export const togglePostLike = async (postId: string, userId: string) => {
  try {
    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (checkError) {
      console.error('Error checking post like:', checkError);
      toast.error('Falha ao verificar curtida');
      throw checkError;
    }

    // If like exists, remove it
    if (existingLike && existingLike.length > 0) {
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', userId);

      if (unlikeError) {
        console.error('Error removing like:', unlikeError);
        toast.error('Falha ao remover curtida');
        throw unlikeError;
      }

      return { 
        action: 'unliked',
        like: null
      };
    } 
    // Otherwise, add like
    else {
      const { data: newLike, error: likeError } = await supabase
        .from('post_likes')
        .insert({
          post_id: postId,
          user_id: userId
        })
        .select()
        .single();

      if (likeError) {
        console.error('Error adding like:', likeError);
        toast.error('Falha ao curtir');
        throw likeError;
      }

      return {
        action: 'liked',
        like: newLike
      };
    }
  } catch (error) {
    console.error('Exception toggling post like:', error);
    throw error;
  }
};

// Toggle like on comment
export const toggleCommentLike = async (commentId: string, userId: string) => {
  try {
    // Check if like already exists
    const { data: existingLike, error: checkError } = await supabase
      .from('comment_likes')
      .select()
      .eq('comment_id', commentId)
      .eq('user_id', userId);

    if (checkError) {
      console.error('Error checking comment like:', checkError);
      toast.error('Falha ao verificar curtida');
      throw checkError;
    }

    // If like exists, remove it
    if (existingLike && existingLike.length > 0) {
      const { error: unlikeError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', userId);

      if (unlikeError) {
        console.error('Error removing like:', unlikeError);
        toast.error('Falha ao remover curtida');
        throw unlikeError;
      }

      return { 
        action: 'unliked',
        like: null
      };
    } 
    // Otherwise, add like
    else {
      const { data: newLike, error: likeError } = await supabase
        .from('comment_likes')
        .insert({
          comment_id: commentId,
          user_id: userId
        })
        .select()
        .single();

      if (likeError) {
        console.error('Error adding like:', likeError);
        toast.error('Falha ao curtir');
        throw likeError;
      }

      return {
        action: 'liked',
        like: newLike
      };
    }
  } catch (error) {
    console.error('Exception toggling comment like:', error);
    throw error;
  }
};

// Delete post
export const deletePost = async (postId: string) => {
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

// Update post
export const updatePost = async (postId: string, data: {
  title: string;
  content: string;
  category?: string;
}) => {
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
    return post;
  } catch (error) {
    console.error('Exception updating post:', error);
    throw error;
  }
};

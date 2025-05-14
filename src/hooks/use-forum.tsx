
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { 
  getAllPosts, 
  getPostById, 
  createPost, 
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  createComment,
  deleteComment,
  likeComment,
  unlikeComment,
  mockPosts
} from "@/services/forumService";
import { Post, Comment } from "@/types/forum";

// Hook for fetching all posts
export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      // Use mock data for development
      const useMockData = true; // Change to false when backend is ready
      return useMockData ? Promise.resolve(mockPosts) : getAllPosts();
    }
  });
};

// Hook for fetching a single post
export const usePost = (postId: number | string | undefined) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId as number),
    enabled: !!postId,
  });
};

// Hook for creating a post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPost: Partial<Post>) => createPost(newPost),
    onSuccess: () => {
      // Invalidate posts query to refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post criado",
        description: "Seu post foi criado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao criar o post",
        variant: "destructive",
      });
    },
  });
};

// Hook for updating a post
export const useUpdatePost = (postId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updatedPost: Partial<Post>) => updatePost(postId, updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast({
        title: "Post atualizado",
        description: "Seu post foi atualizado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao atualizar o post",
        variant: "destructive",
      });
    },
  });
};

// Hook for deleting a post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post excluído",
        description: "Seu post foi excluído com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao excluir o post",
        variant: "destructive",
      });
    },
  });
};

// Hook for liking/unliking a post
export const usePostLike = (postId: number) => {
  const queryClient = useQueryClient();
  
  const likeMutation = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao curtir o post",
        variant: "destructive",
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao descurtir o post",
        variant: "destructive",
      });
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
};

// Hook for creating a comment
export const useCreateComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newComment: Partial<Comment>) => createComment(newComment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", data.post_id] });
      toast({
        title: "Comentário adicionado",
        description: "Seu comentário foi adicionado com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao adicionar o comentário",
        variant: "destructive",
      });
    },
  });
};

// Hook for deleting a comment
export const useDeleteComment = (postId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast({
        title: "Comentário excluído",
        description: "Seu comentário foi excluído com sucesso",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao excluir o comentário",
        variant: "destructive",
      });
    },
  });
};

// Hook for liking/unliking a comment
export const useCommentLike = (postId: number, commentId: number) => {
  const queryClient = useQueryClient();
  
  const likeMutation = useMutation({
    mutationFn: () => likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao curtir o comentário",
        variant: "destructive",
      });
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao descurtir o comentário",
        variant: "destructive",
      });
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
};

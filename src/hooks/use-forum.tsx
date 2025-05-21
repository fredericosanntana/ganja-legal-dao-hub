
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
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
      // Use real data from the database
      const useMockData = false; // Set to false to use real data
      return useMockData ? Promise.resolve(mockPosts) : getAllPosts();
    }
  });
};

// Hook for fetching a single post
export const usePost = (postId: string | undefined) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId as string),
    enabled: !!postId,
  });
};

// Hook for creating a post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (newPost: {
      title: string;
      content: string;
      user_id: string;
      category?: string;
    }) => {
      console.log("Creating post in mutation:", newPost);
      return createPost(newPost);
    },
    onSuccess: () => {
      // Invalidate posts query to refetch
      console.log("Post created successfully, invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      console.error("Error in useCreatePost mutation:", error);
      toast.error(error.message || "Ocorreu um erro ao criar o post");
    },
  });
};

// Hook for updating a post
export const useUpdatePost = (postId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updatedPost: {
      title: string;
      content: string;
      category?: string;
    }) => updatePost(postId, updatedPost),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Post atualizado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao atualizar o post");
    },
  });
};

// Hook for deleting a post
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post excluído com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao excluir o post");
    },
  });
};

// Hook for liking/unliking a post
export const usePostLike = (postId: string) => {
  const queryClient = useQueryClient();
  
  const likeMutation = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao curtir o post");
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao descurtir o post");
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
    mutationFn: (newComment: {
      content: string;
      user_id: string;
      post_id: string;
      parent_id?: string;
    }) => createComment(newComment),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["post", data?.post_id] });
      toast.success("Comentário adicionado com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao adicionar o comentário");
    },
  });
};

// Hook for deleting a comment
export const useDeleteComment = (postId: string) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (commentId: string) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      toast.success("Comentário excluído com sucesso");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao excluir o comentário");
    },
  });
};

// Hook for liking/unliking a comment
export const useCommentLike = (postId: string, commentId: string) => {
  const queryClient = useQueryClient();
  
  const likeMutation = useMutation({
    mutationFn: () => likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao curtir o comentário");
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Ocorreu um erro ao descurtir o comentário");
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
  };
};

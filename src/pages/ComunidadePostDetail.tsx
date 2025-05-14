
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, MessageSquare, ThumbsUp, ThumbsDown, Edit, Trash2 } from "lucide-react";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { usePost, usePostLike, useDeletePost } from "@/hooks/use-forum";
import Comment from "@/components/forum/Comment";
import CommentForm from "@/components/forum/CommentForm";

const ComunidadePostDetail = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { data: post, isLoading, error } = usePost(postId);
  const { like, unlike, isLiking, isUnliking } = usePostLike(Number(postId));
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const isAuthor = user?.id === post?.user_id;
  const isLiked = post?.likes?.some(like => like.user_id === user?.id) || false;
  const formattedDate = post ? formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  }) : '';

  const handleLike = () => {
    if (!isAuthenticated) {
      navigate("/clube/login");
      return;
    }
    
    if (isLiked) {
      unlike();
    } else {
      like();
    }
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este post?")) {
      deletePost(Number(postId), {
        onSuccess: () => {
          navigate("/clube/comunidade");
        }
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6 text-center">
          <p>Carregando post...</p>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Post não encontrado</h2>
            <p className="text-muted-foreground mb-6">
              O post que você está procurando não existe ou foi removido.
            </p>
            <Button asChild>
              <Link to="/clube/comunidade">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar para a Comunidade
              </Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/clube/comunidade">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Comunidade
          </Link>
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                      <span>Por {post.author?.username || "Usuário"}</span>
                      <span>•</span>
                      <span>{formattedDate}</span>
                      {post.category && (
                        <>
                          <span>•</span>
                          <Badge variant="outline">{post.category}</Badge>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {isAuthor && (
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/clube/comunidade/editar/${post.id}`}>
                          <Edit className="mr-1 h-4 w-4" /> Editar
                        </Link>
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={handleDelete}
                        disabled={isDeleting}
                      >
                        <Trash2 className="mr-1 h-4 w-4" /> Excluir
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="prose max-w-none mb-6">
                  {post.content.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
                
                <div className="flex items-center space-x-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLike}
                    disabled={isLiking || isUnliking}
                  >
                    {isLiked ? (
                      <>
                        <ThumbsUp className="mr-1 h-4 w-4 text-primary fill-primary" />
                        Curtido ({post._count?.likes || 0})
                      </>
                    ) : (
                      <>
                        <ThumbsUp className="mr-1 h-4 w-4" />
                        Curtir ({post._count?.likes || 0})
                      </>
                    )}
                  </Button>
                  
                  <Button variant="outline" size="sm">
                    <MessageSquare className="mr-1 h-4 w-4" />
                    Comentários ({post._count?.comments || 0})
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Comentários</h2>
              
              {isAuthenticated ? (
                <CommentForm postId={Number(postId)} />
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="mb-4">Faça login para comentar</p>
                    <Button asChild>
                      <Link to="/clube/login">Fazer Login</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
              
              <div className="space-y-4">
                {post.comments && post.comments.length > 0 ? (
                  post.comments
                    .filter(comment => !comment.parent_id) // Show only top-level comments
                    .map(comment => (
                      <Comment 
                        key={comment.id} 
                        comment={comment} 
                        postId={Number(postId)} 
                      />
                    ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-2">Sobre o autor</h3>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    {post.author?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-medium">{post.author?.username || "Usuário"}</p>
                    <p className="text-xs text-muted-foreground">Membro</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Posts relacionados</h3>
                <p className="text-sm text-muted-foreground">
                  O sistema de recomendações será implementado em breve.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComunidadePostDetail;

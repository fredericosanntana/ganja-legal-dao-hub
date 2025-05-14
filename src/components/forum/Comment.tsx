
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, ThumbsUp, ThumbsDown, Edit, Trash2 } from "lucide-react";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Comment as CommentType } from "@/types/forum";
import { useAuth } from "@/hooks/use-auth";
import { useCommentLike, useDeleteComment } from "@/hooks/use-forum";
import CommentForm from "./CommentForm";

interface CommentProps {
  comment: CommentType;
  postId: number;
}

const Comment = ({ comment, postId }: CommentProps) => {
  const { user } = useAuth();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { like, unlike, isLiking, isUnliking } = useCommentLike(postId, comment.id);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment(postId);
  
  const formattedDate = formatDistanceToNow(new Date(comment.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const isAuthor = user?.id === comment.user_id;
  const isLiked = comment.likes?.some(like => like.user_id === user?.id) || false;
  const likeCount = comment._count?.likes || 0;
  
  const handleLike = () => {
    if (isLiked) {
      unlike();
    } else {
      like();
    }
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      deleteComment(comment.id);
    }
  };

  return (
    <Card className="border-l-4 mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm font-medium">{comment.author?.username || "Usuário"}</div>
            <div className="text-xs text-muted-foreground">{formattedDate}</div>
          </div>
          
          {isAuthor && (
            <div className="flex space-x-1">
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <Edit className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          )}
        </div>
        
        <p className="mt-2 text-sm">{comment.content}</p>
        
        <div className="mt-4 flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={handleLike}
            disabled={isLiking || isUnliking}
          >
            {isLiked ? (
              <ThumbsUp className="mr-1 h-3.5 w-3.5 text-primary fill-primary" />
            ) : (
              <ThumbsUp className="mr-1 h-3.5 w-3.5" />
            )}
            {likeCount}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-xs"
            onClick={() => setShowReplyForm(!showReplyForm)}
          >
            <MessageSquare className="mr-1 h-3.5 w-3.5" />
            Responder
          </Button>
        </div>
        
        {showReplyForm && (
          <div className="mt-4">
            <CommentForm 
              postId={postId} 
              parentId={comment.id}
              onSuccess={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </CardContent>
      
      {comment.replies && comment.replies.length > 0 && (
        <CardFooter className="p-0">
          <div className="w-full pl-6 pr-4 pb-4">
            <div className="border-l-2 pl-4 pt-2 space-y-4">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="border rounded-md p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm font-medium">{reply.author?.username || "Usuário"}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.created_at), {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-sm">{reply.content}</p>
                </div>
              ))}
            </div>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default Comment;

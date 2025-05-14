
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageSquare, ThumbsUp } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Post } from "@/types/forum";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: Post;
  compact?: boolean;
}

const PostCard = ({ post, compact = false }: PostCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ptBR,
  });

  const commentCount = post._count?.comments || 0;
  const likeCount = post._count?.likes || 0;

  return (
    <Card className={cn("transition-shadow hover:shadow-md", 
      compact ? "border-l-4" : ""
    )}>
      <CardHeader className="pb-2 space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <Link to={`/clube/comunidade/posts/${post.id}`} className="hover:underline">
              <h3 className={cn(
                "font-medium line-clamp-2 hover:text-primary transition-colors",
                compact ? "text-base" : "text-lg"
              )}>
                {post.title}
              </h3>
            </Link>
            {post.category && (
              <Badge variant="outline" className="mt-1">
                {post.category}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      
      {!compact && (
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
        </CardContent>
      )}
      
      <CardFooter className="pt-2 text-xs text-muted-foreground">
        <div className="flex justify-between w-full items-center">
          <div className="flex space-x-2">
            <span>Por {post.author?.username || "Usuário"}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <ThumbsUp className="h-3.5 w-3.5 mr-1" />
              <span>{likeCount}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              <span>{commentCount}</span>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PostCard;

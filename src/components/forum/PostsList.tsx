
import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import { Post, POST_CATEGORIES } from "@/types/forum";
import { useAuth } from "@/hooks/use-auth";
import PostCard from "./PostCard";

interface PostsListProps {
  posts: Post[];
  isLoading: boolean;
}

const PostsList = ({ posts, isLoading }: PostsListProps) => {
  const { user, isAuthenticated } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredPosts = posts.filter(post => {
    // Filter by category if selected
    if (activeCategory && post.category !== activeCategory) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(query) || 
        post.content.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <p>Carregando posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full">
          <Input
            placeholder="Pesquisar posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
       
      </div>
      
      <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide">
        <Button 
          variant={activeCategory === null ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory(null)}
        >
          Todos
        </Button>
        {POST_CATEGORIES.map((category) => (
          <Button 
            key={category.value}
            variant={activeCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>
      
      {filteredPosts.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">Nenhum post encontrado.</p>
            {isAuthenticated && (
              <Button className="mt-4" asChild>
                <Link to="/clube/comunidade/novo">
                  <Plus className="mr-2 h-4 w-4" /> Criar o primeiro post
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostsList;

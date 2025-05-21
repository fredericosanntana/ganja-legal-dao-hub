
import { Link } from "react-router-dom";
import { BookOpen, MessageSquare, ThumbsUp, Vote } from "lucide-react";

import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { usePosts } from "@/hooks/use-forum";
import PostsList from "@/components/forum/PostsList";

const Comunidade = () => {
  const { user, isAuthenticated } = useAuth();
  const { data: posts, isLoading } = usePosts();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Comunidade</h1>
            <p className="text-muted-foreground mt-1">
              Discuta, proponha e vote em iniciativas da comunidade GanjaDAO
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="posts">
              <TabsList className="mb-6">
                <TabsTrigger value="posts" className="flex items-center">
                  <MessageSquare className="mr-2 h-4 w-4" /> 
                  Posts
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts">
                <PostsList posts={posts || []} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="iniciativas">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Iniciativas Ativas</h2>
                    
                    {isAuthenticated && (
                      <Button asChild>
                        <Link to="/clube/iniciativas/nova">
                          Propor Iniciativa
                        </Link>
                      </Button>
                    )}
                  </div>
                  
                  <Card>
                    <CardContent className="py-6">
                      <Link to="/clube/iniciativas" className="block">
                        <Button variant="outline" className="w-full">
                          <Vote className="mr-2 h-4 w-4" />
                          Ver todas as iniciativas
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="space-y-6">
            {!isAuthenticated ? (
              <Card>
                <CardHeader>
                  <CardTitle>Junte-se à Comunidade</CardTitle>
                  <CardDescription>
                    Faça login ou cadastre-se para participar das discussões
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link to="/clube/login">Fazer Login</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/clube/cadastro">Criar Conta</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Bem-vindo, {user?.username}!</CardTitle>
                  <CardDescription>
                    Participe ativamente da nossa comunidade
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link to="/clube/comunidade/novo">Criar Novo Post</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/clube/iniciativas/nova">Propor Iniciativa</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" /> Guia da Comunidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium">Regras de Convivência:</h4>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 mt-1">
                    <li>Respeite todos os membros</li>
                    <li>Evite linguagem ofensiva</li>
                    <li>Não compartilhe conteúdo ilegal</li>
                    <li>Mantenha o debate construtivo</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium">Votação Quadrática:</h4>
                  <p className="text-muted-foreground mt-1">
                    Nosso sistema usa votação quadrática para decisões coletivas. 
                    Saiba mais sobre como funciona no nosso guia de iniciativas.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Comunidade;
